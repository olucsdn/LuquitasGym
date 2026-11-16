import { createClient } from '@supabase/supabase-js';
import { INITIAL_QUOTES, SYSTEM_WORKOUTS } from './workoutData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('seu-projeto.supabase.co')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// LOCAL STORAGE KEYS & OFFLINE SYNC REPOSITORY
// ==============================================================================

const STORAGE_KEYS = {
  ACTIVE_SESSION: (userId) => `luquitasgym_active_session_${userId || 'guest'}`,
  LOCAL_HISTORY: (userId) => `luquitasgym_history_${userId || 'guest'}`,
  LOCAL_QUOTES: (userId) => `luquitasgym_quotes_${userId || 'guest'}`,
  LOCAL_PROFILE: (userId) => `luquitasgym_profile_${userId || 'guest'}`,
  SYNC_QUEUE: (userId) => `luquitasgym_sync_queue_${userId || 'guest'}`,
};

// Carrega perfil local
export function getLocalProfile(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_PROFILE(userId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler perfil local', e);
  }
  return {
    id: userId || 'local-user',
    display_name: 'Lucas (Hardcore)',
    role: 'admin',
    current_phase: 'week_1'
  };
}

// Salva perfil local
export function saveLocalProfile(userId, profileData) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCAL_PROFILE(userId), JSON.stringify(profileData));
  } catch (e) {
    console.error('Erro ao salvar perfil local', e);
  }
}

// Salva sessão em andamento no cache (Anti-queda de sinal)
export function saveActiveSessionLocal(userId, sessionData) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION(userId), JSON.stringify(sessionData));
  } catch (e) {
    console.error('Erro ao salvar sessão ativa localmente', e);
  }
}

// Recupera sessão ativa não finalizada
export function getActiveSessionLocal(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION(userId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Limpa sessão ativa concluída
export function clearActiveSessionLocal(userId) {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION(userId));
  } catch (e) {}
}

// Recupera histórico de treinos concluídos
export async function getCompletedSessions(userId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          workout_id,
          started_at,
          completed_at,
          phase_at_time,
          warmup_completed,
          notes,
          set_logs (
            id,
            exercise_id,
            set_number,
            weight_kg,
            reps,
            rir,
            completed
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Fallback para histórico local do Supabase:', err);
    }
  }

  // Fallback LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_HISTORY(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Salva sessão concluída
export async function saveCompletedSession(userId, sessionPayload) {
  let savedToRemote = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userId,
          workout_id: sessionPayload.workout_id,
          started_at: sessionPayload.started_at,
          completed_at: sessionPayload.completed_at || new Date().toISOString(),
          phase_at_time: sessionPayload.phase_at_time,
          warmup_completed: sessionPayload.warmup_completed,
          notes: sessionPayload.notes || ''
        })
        .select()
        .single();

      if (!sessionError && sessionData) {
        // Insere set logs
        const logsToInsert = sessionPayload.logs.map(log => ({
          user_id: userId,
          session_id: sessionData.id,
          exercise_id: log.exercise_id,
          set_number: log.set_number,
          weight_kg: Number(log.weight_kg) || 0,
          reps: Number(log.reps) || 0,
          rir: log.rir ?? null,
          completed: log.completed
        }));

        await supabase.from('set_logs').insert(logsToInsert);
        savedToRemote = true;
      }
    } catch (e) {
      console.warn('Falha ao salvar no Supabase, enfileirando para sincronização offline', e);
    }
  }

  // Se falhou no remoto mas temos Supabase configurado, enfileira para sincronização
  if (!savedToRemote && isSupabaseConfigured) {
    try {
      const queueRaw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE(userId));
      const queue = queueRaw ? JSON.parse(queueRaw) : [];
      queue.push(sessionPayload);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE(userId), JSON.stringify(queue));
    } catch (err) {
      console.error('Erro ao adicionar sessão à fila de sincronização:', err);
    }
  }

  // Salva no LocalStorage como persistência garantida
  try {
    const history = await getCompletedSessions(userId);
    const newSession = {
      id: `local-sess-${Date.now()}`,
      user_id: userId,
      workout_id: sessionPayload.workout_id,
      started_at: sessionPayload.started_at,
      completed_at: sessionPayload.completed_at || new Date().toISOString(),
      phase_at_time: sessionPayload.phase_at_time,
      warmup_completed: sessionPayload.warmup_completed,
      notes: sessionPayload.notes,
      set_logs: sessionPayload.logs
    };
    const updatedHistory = [newSession, ...history];
    localStorage.setItem(STORAGE_KEYS.LOCAL_HISTORY(userId), JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Erro ao salvar localmente:', e);
  }

  clearActiveSessionLocal(userId);
  return { success: true, savedToRemote };
}

// Processa fila de sincronização pendente (Acionada ao restabelecer conexão)
export async function processSyncQueue(userId) {
  if (!isSupabaseConfigured || !supabase || !navigator.onLine) return { synced: 0 };

  try {
    const queueRaw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE(userId));
    if (!queueRaw) return { synced: 0 };
    const queue = JSON.parse(queueRaw);
    if (!Array.isArray(queue) || queue.length === 0) return { synced: 0 };

    const remaining = [];
    let syncedCount = 0;

    for (const sessionPayload of queue) {
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: userId,
            workout_id: sessionPayload.workout_id,
            started_at: sessionPayload.started_at,
            completed_at: sessionPayload.completed_at || new Date().toISOString(),
            phase_at_time: sessionPayload.phase_at_time,
            warmup_completed: sessionPayload.warmup_completed,
            notes: sessionPayload.notes || ''
          })
          .select()
          .single();

        if (!sessionError && sessionData) {
          const logsToInsert = sessionPayload.logs.map(log => ({
            user_id: userId,
            session_id: sessionData.id,
            exercise_id: log.exercise_id,
            set_number: log.set_number,
            weight_kg: Number(log.weight_kg) || 0,
            reps: Number(log.reps) || 0,
            rir: log.rir ?? null,
            completed: log.completed
          }));

          await supabase.from('set_logs').insert(logsToInsert);
          syncedCount++;
        } else {
          remaining.push(sessionPayload);
        }
      } catch (err) {
        remaining.push(sessionPayload);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE(userId), JSON.stringify(remaining));
    return { synced: syncedCount };
  } catch (e) {
    console.error('Erro ao processar fila de sincronização:', e);
    return { synced: 0 };
  }
}

// Frases Motivacionais (Supabase + Fallback)
export async function getQuotes(userId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(q => ({
          id: q.id,
          quote_text: q.quote_text,
          is_custom: q.is_custom || Boolean(q.user_id)
        }));
      }
    } catch (e) {}
  }

  // Fallback Local
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_QUOTES(userId));
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const defaults = INITIAL_QUOTES.map((q, idx) => ({
    id: `default-${idx}`,
    quote_text: q,
    is_custom: false
  }));
  return defaults;
}

export async function addQuote(userId, text) {
  const newQuote = {
    id: `quote-${Date.now()}`,
    quote_text: text.trim(),
    is_custom: true
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('motivational_quotes').insert({
        user_id: userId,
        quote_text: text.trim(),
        is_custom: true
      });
    } catch (e) {}
  }

  // Salva no Local
  try {
    const quotes = await getQuotes(userId);
    const updated = [newQuote, ...quotes];
    localStorage.setItem(STORAGE_KEYS.LOCAL_QUOTES(userId), JSON.stringify(updated));
  } catch (e) {}

  return newQuote;
}

export async function deleteQuote(userId, quoteId) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('motivational_quotes').delete().eq('id', quoteId);
    } catch (e) {}
  }

  try {
    const quotes = await getQuotes(userId);
    const updated = quotes.filter(q => q.id !== quoteId);
    localStorage.setItem(STORAGE_KEYS.LOCAL_QUOTES(userId), JSON.stringify(updated));
  } catch (e) {}
}

// ==============================================================================
// BACKUP & PORTABILIDADE LOCAL (USO PESSOAL SEGURO)
// ==============================================================================

/**
 * Exporta todo o histórico de treinos, perfil e frases em JSON
 */
export function exportUserDataJSON(userId) {
  const profile = getLocalProfile(userId);
  const rawHistory = localStorage.getItem(STORAGE_KEYS.LOCAL_HISTORY(userId));
  const rawQuotes = localStorage.getItem(STORAGE_KEYS.LOCAL_QUOTES(userId));

  const backup = {
    version: '1.0',
    app: 'LuquitasGym',
    exported_at: new Date().toISOString(),
    user_id: userId,
    profile: profile,
    history: rawHistory ? JSON.parse(rawHistory) : [],
    quotes: rawQuotes ? JSON.parse(rawQuotes) : []
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `luquitasgym-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Importa dados de um arquivo JSON de backup
 */
export function importUserDataJSON(userId, jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Arquivo de backup inválido.');
  }

  if (jsonData.profile) {
    saveLocalProfile(userId, jsonData.profile);
  }
  if (Array.isArray(jsonData.history)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_HISTORY(userId), JSON.stringify(jsonData.history));
  }
  if (Array.isArray(jsonData.quotes)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_QUOTES(userId), JSON.stringify(jsonData.quotes));
  }
  return true;
}
