// Repositório e Gerenciador de Autenticação Segura — LuquitasGym

const USERS_STORAGE_KEY = 'luquitasgym_registered_users';
const CURRENT_SESSION_KEY = 'luquitasgym_auth_session';
const LOGOUT_FLAG_KEY = 'luquitasgym_explicit_logout';

// Conta Pessoal do Dono (Zero fricção & Auto-inicialização)
export const DEFAULT_PERSONAL_USER = {
  id: 'owner-luquitas-personal',
  username: 'luquitas',
  email: 'luquitas@luquitasgym.local',
  display_name: 'Lucas (Dono)',
  role: 'admin',
  user_metadata: {
    display_name: 'Lucas (Dono)',
    role: 'admin'
  }
};

/**
 * Inicializa e recupera a lista de usuários cadastrados
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const users = raw ? JSON.parse(raw) : [];
    
    // Garante que a conta pessoal sempre exista no registro local
    const hasOwner = users.some(u => u.username === DEFAULT_PERSONAL_USER.username);
    if (!hasOwner) {
      users.unshift({
        id: DEFAULT_PERSONAL_USER.id,
        username: DEFAULT_PERSONAL_USER.username,
        email: DEFAULT_PERSONAL_USER.email,
        display_name: DEFAULT_PERSONAL_USER.display_name,
        role: DEFAULT_PERSONAL_USER.role
      });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  } catch (e) {
    console.error('Erro ao ler usuários registrados:', e);
    return [DEFAULT_PERSONAL_USER];
  }
}

/**
 * Autentica usuário com validação de credenciais
 * @param {string} identifier - Nome de usuário ou e-mail
 * @param {string} password - Senha digitada
 */
export function authenticateLocal(identifier, password) {
  const cleanId = String(identifier || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanId) {
    throw new Error('Informe o usuário ou e-mail.');
  }

  // Acesso direto à conta pessoal do Dono
  if (cleanId === 'luquitas' || cleanId === 'luquitas@luquitasgym.local' || cleanId === 'luquitas@luquitasgym.com') {
    localStorage.removeItem(LOGOUT_FLAG_KEY);
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(DEFAULT_PERSONAL_USER));
    return DEFAULT_PERSONAL_USER;
  }

  const users = getRegisteredUsers();
  const user = users.find(u => 
    (u.username && u.username.toLowerCase() === cleanId) || 
    (u.email && u.email.toLowerCase() === cleanId)
  );

  if (!user || (user.password && user.password !== cleanPass)) {
    throw new Error('Usuário ou senha incorretos. Caso ainda não tenha conta, clique em "Criar Conta".');
  }

  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    user_metadata: {
      display_name: user.display_name,
      role: user.role || 'user'
    }
  };

  localStorage.removeItem(LOGOUT_FLAG_KEY);
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Registra novo usuário no sistema
 */
export function registerLocal({ displayName, usernameOrEmail, password }) {
  const cleanName = String(displayName || '').trim();
  const cleanId = String(usernameOrEmail || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanName) {
    throw new Error('Por favor, informe seu nome ou apelido.');
  }
  if (!cleanId || cleanId.length < 3) {
    throw new Error('O usuário/e-mail deve ter pelo menos 3 caracteres.');
  }
  if (!cleanPass || cleanPass.length < 4) {
    throw new Error('A senha deve ter pelo menos 4 caracteres.');
  }

  const users = getRegisteredUsers();

  const exists = users.some(u => 
    (u.username && u.username.toLowerCase() === cleanId) || 
    (u.email && u.email.toLowerCase() === cleanId)
  );

  if (exists) {
    throw new Error('Este usuário ou e-mail já está cadastrado. Faça login na aba "Entrar".');
  }

  const isEmail = cleanId.includes('@');
  const newUser = {
    id: `user-${Date.now()}`,
    username: isEmail ? cleanId.split('@')[0] : cleanId,
    email: isEmail ? cleanId : `${cleanId}@luquitasgym.local`,
    password: cleanPass,
    display_name: cleanName,
    role: 'user'
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const sessionUser = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    user_metadata: {
      display_name: newUser.display_name,
      role: newUser.role
    }
  };

  localStorage.removeItem(LOGOUT_FLAG_KEY);
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Recupera sessão ativa com Auto-Login para uso pessoal
 */
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) return JSON.parse(raw);

    // Modo Pessoal Instantâneo:
    // Se não há logout explícito ativo, inicializa direto a conta do Dono
    const explicitlyLoggedOut = localStorage.getItem(LOGOUT_FLAG_KEY) === 'true';
    if (!explicitlyLoggedOut) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(DEFAULT_PERSONAL_USER));
      return DEFAULT_PERSONAL_USER;
    }
    return null;
  } catch (e) {
    return DEFAULT_PERSONAL_USER;
  }
}

/**
 * Remove sessão ativa ao deslogar explicitamente
 */
export function clearStoredSession() {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
    localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
  } catch (e) {
    // Ignora
  }
}
