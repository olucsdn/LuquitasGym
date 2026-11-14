-- ==============================================================================
-- LUQUITASGYM - DATABASE SCHEMA & SEED DATA (SUPABASE / POSTGRESQL)
-- Multi-Tenant, Zero-Cost Ready, RLS Enabled
-- ==============================================================================

-- 1. TABELA DE PERFIS DE USUÁRIO
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    current_phase TEXT NOT NULL DEFAULT 'week_1' CHECK (current_phase IN ('week_1', 'week_2', 'week_3_plus')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para sincronizar perfil automaticamente ao cadastrar em auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, role, current_phase)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'user',
        'week_1'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. TABELA DE FRASES MOTIVACIONAIS BRUTAIS (HARDCORE MINDSET ENGINE)
CREATE TABLE IF NOT EXISTS public.motivational_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE TREINOS (WORKOUTS)
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_system_template BOOLEAN NOT NULL DEFAULT FALSE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex, 6: Sab, 7: Dom
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    focus TEXT,
    estimated_duration_min INT NOT NULL DEFAULT 60,
    is_optional BOOLEAN NOT NULL DEFAULT FALSE,
    is_upper_body BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. TABELA DE EXERCÍCIOS
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    name TEXT NOT NULL,
    default_sets INT NOT NULL DEFAULT 3,
    min_reps INT NOT NULL DEFAULT 8,
    max_reps INT NOT NULL DEFAULT 12,
    is_compound BOOLEAN NOT NULL DEFAULT FALSE,
    rest_seconds INT NOT NULL DEFAULT 90,
    execution_notes TEXT
);

-- 5. TABELA DE SESSÕES DE TREINO (WORKOUT SESSIONS)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    phase_at_time TEXT NOT NULL,
    warmup_completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT
);

-- 6. TABELA DE LOGS DE SÉRIES (SET LOGS)
CREATE TABLE IF NOT EXISTS public.set_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 0,
    reps INT NOT NULL DEFAULT 0,
    rir INT,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: leitura e atualização do próprio registro
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Quotes: Frases globais (user_id IS NULL) visíveis para todos, customizadas só pelo dono
DROP POLICY IF EXISTS "quotes_select_policy" ON public.motivational_quotes;
CREATE POLICY "quotes_select_policy" ON public.motivational_quotes
    FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "quotes_insert_policy" ON public.motivational_quotes;
CREATE POLICY "quotes_insert_policy" ON public.motivational_quotes
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "quotes_update_policy" ON public.motivational_quotes;
CREATE POLICY "quotes_update_policy" ON public.motivational_quotes
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "quotes_delete_policy" ON public.motivational_quotes;
CREATE POLICY "quotes_delete_policy" ON public.motivational_quotes
    FOR DELETE USING (user_id = auth.uid());

-- Workouts: Templates do sistema (user_id IS NULL) visíveis para todos
DROP POLICY IF EXISTS "workouts_select_policy" ON public.workouts;
CREATE POLICY "workouts_select_policy" ON public.workouts
    FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "workouts_insert_policy" ON public.workouts;
CREATE POLICY "workouts_insert_policy" ON public.workouts
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "workouts_update_policy" ON public.workouts;
CREATE POLICY "workouts_update_policy" ON public.workouts
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "workouts_delete_policy" ON public.workouts;
CREATE POLICY "workouts_delete_policy" ON public.workouts
    FOR DELETE USING (user_id = auth.uid());

-- Exercises: Visível se o treino pertencer ao usuário ou for template do sistema
DROP POLICY IF EXISTS "exercises_select_policy" ON public.exercises;
CREATE POLICY "exercises_select_policy" ON public.exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workouts w 
            WHERE w.id = exercises.workout_id 
            AND (w.user_id IS NULL OR w.user_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "exercises_insert_policy" ON public.exercises;
CREATE POLICY "exercises_insert_policy" ON public.exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workouts w 
            WHERE w.id = exercises.workout_id 
            AND w.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "exercises_update_policy" ON public.exercises;
CREATE POLICY "exercises_update_policy" ON public.exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workouts w 
            WHERE w.id = exercises.workout_id 
            AND w.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "exercises_delete_policy" ON public.exercises;
CREATE POLICY "exercises_delete_policy" ON public.exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workouts w 
            WHERE w.id = exercises.workout_id 
            AND w.user_id = auth.uid()
        )
    );

-- Workout Sessions: Somente o próprio usuário
DROP POLICY IF EXISTS "sessions_all_policy" ON public.workout_sessions;
CREATE POLICY "sessions_all_policy" ON public.workout_sessions
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Set Logs: Somente o próprio usuário
DROP POLICY IF EXISTS "set_logs_all_policy" ON public.set_logs;
CREATE POLICY "set_logs_all_policy" ON public.set_logs
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- SEED DATA: FRASES BRUTAIS GLOBAIS (HARDCORE MINDSET ENGINE)
-- ==============================================================================

INSERT INTO public.motivational_quotes (user_id, quote_text, is_custom) VALUES
(NULL, 'Não dê seu mínimo como fizeram com você.', FALSE),
(NULL, 'Você tá dando o mínimo nesse treino que nunca mais voltará?', FALSE),
(NULL, 'Eles entregaram o mínimo e foram embora. Você vai fazer o mesmo com você?', FALSE),
(NULL, 'Esse dia não volta. Essa série não volta. Faz valer cada repetição.', FALSE),
(NULL, 'O ferro não mente, não tem pena e não aceita desculpas.', FALSE),
(NULL, 'Você prometeu que nunca mais ia voltar à estaca zero. Cumpra sua palavra.', FALSE),
(NULL, 'Enquanto você negocia com o cansaço, o tempo passa do mesmo jeito.', FALSE),
(NULL, 'Mais uma repetição limpa ou mais uma desculpa bem contada?', FALSE),
(NULL, 'Ninguém vem te salvar. A responsabilidade é 100% sua.', FALSE),
(NULL, 'Desconforto temporário agora ou o peso do arrependimento depois: escolhe.', FALSE),
(NULL, 'Sua mente vai pedir para parar 3 repetições antes do músculo. Não obedeça.', FALSE),
(NULL, 'Todo mundo quer o resultado, poucos suportam a monotonia de fazer o que precisa ser feito.', FALSE)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- SEED DATA: FICHA OFICIAL LUQUITASGYM (6 DIAS - SYSTEM TEMPLATE)
-- ==============================================================================

DO $$
DECLARE
    w_seg UUID := '00000000-0000-0000-0000-000000000001'::UUID;
    w_ter UUID := '00000000-0000-0000-0000-000000000002'::UUID;
    w_qua UUID := '00000000-0000-0000-0000-000000000003'::UUID;
    w_qui UUID := '00000000-0000-0000-0000-000000000004'::UUID;
    w_sex UUID := '00000000-0000-0000-0000-000000000005'::UUID;
    w_sab UUID := '00000000-0000-0000-0000-000000000006'::UUID;
BEGIN
    -- Limpeza de templates anteriores para recriação idempotente
    DELETE FROM public.workouts WHERE is_system_template = TRUE;

    -- SEGUNDA-FEIRA: Upper A
    INSERT INTO public.workouts (id, user_id, is_system_template, day_of_week, slug, title, focus, estimated_duration_min, is_optional, is_upper_body)
    VALUES (w_seg, NULL, TRUE, 1, 'upper-a', 'Upper A', 'Corpo em V + Braços', 65, FALSE, TRUE);

    INSERT INTO public.exercises (workout_id, order_index, name, default_sets, min_reps, max_reps, is_compound, rest_seconds, execution_notes) VALUES
    (w_seg, 1, 'Puxada frontal com triângulo (pegada neutra)', 3, 8, 12, TRUE, 150, 'Substitui puxada aberta rígida; mantém ombro no plano escapular sem pinçamento.'),
    (w_seg, 2, 'Supino inclinado com halteres (banco a 30°)', 3, 8, 12, TRUE, 150, 'Constrói peitoral superior, essencial para o aspecto em V.'),
    (w_seg, 3, 'Remada baixa na polia (pegada neutra)', 3, 10, 12, TRUE, 150, 'Puxe em direção ao umbigo para focar no grande dorsal.'),
    (w_seg, 4, 'Elevação lateral com halteres', 4, 12, 15, FALSE, 90, 'Tronco levemente inclinado à frente, subindo no plano da escápula.'),
    (w_seg, 5, 'Crucifixo inverso na máquina ou polia', 3, 12, 15, FALSE, 90, 'Foco em deltoide posterior e estabilidade escapular.'),
    (w_seg, 6, 'Rosca direta na polia (barra W ou reta)', 3, 10, 12, FALSE, 90, 'Tensão contínua e suave para o cotovelo.'),
    (w_seg, 7, 'Tríceps na polia com barra V', 3, 10, 12, FALSE, 90, 'Foco na cabeça lateral do tríceps.');

    -- TERÇA-FEIRA: Módulo Extra (Opcional)
    INSERT INTO public.workouts (id, user_id, is_system_template, day_of_week, slug, title, focus, estimated_duration_min, is_optional, is_upper_body)
    VALUES (w_ter, NULL, TRUE, 2, 'modulo-extra', 'Módulo Extra Estético', 'Baixa Fadiga Articular', 45, TRUE, TRUE);

    INSERT INTO public.exercises (workout_id, order_index, name, default_sets, min_reps, max_reps, is_compound, rest_seconds, execution_notes) VALUES
    (w_ter, 1, 'Elevação lateral na polia (cabo passando atrás do corpo)', 3, 15, 20, FALSE, 90, 'Executar sempre com 2 reps na reserva (2 RIR), sem desgaste articular.'),
    (w_ter, 2, 'Face pull na polia com corda (puxando na altura da testa)', 3, 15, 20, FALSE, 90, 'Foco na rotação externa e integridade dos manguitos.'),
    (w_ter, 3, 'Rosca martelo na polia com corda', 3, 12, 15, FALSE, 90, 'Foco no braquial, que empurra o bíceps para cima.'),
    (w_ter, 4, 'Tríceps corda unilateral ou bilateral', 3, 12, 15, FALSE, 90, 'Abertura total da corda no ponto de contração máxima.'),
    (w_ter, 5, 'Prancha abdominal ou abdominal supra na polia', 3, 12, 15, FALSE, 90, 'Contração abdominal isométrica consistente.');

    -- QUARTA-FEIRA: Lower A
    INSERT INTO public.workouts (id, user_id, is_system_template, day_of_week, slug, title, focus, estimated_duration_min, is_optional, is_upper_body)
    VALUES (w_qua, NULL, TRUE, 3, 'lower-a', 'Lower A', 'Largura de Coxas & Panturrilha', 65, FALSE, FALSE);

    INSERT INTO public.exercises (workout_id, order_index, name, default_sets, min_reps, max_reps, is_compound, rest_seconds, execution_notes) VALUES
    (w_qua, 1, 'Agachamento Hack ou no Smith', 4, 8, 10, TRUE, 180, 'Pés na largura do quadril e mais abaixo na plataforma, joelho avançando à frente — máximo estímulo no vasto lateral.'),
    (w_qua, 2, 'Mesa flexora', 3, 10, 12, FALSE, 90, 'Quadril pressionado contra o banco para não compensar lombar.'),
    (w_qua, 3, 'Cadeira extensora', 3, 12, 15, FALSE, 90, 'Segure 1 segundo no topo e desça em 2 segundos controlados.'),
    (w_qua, 4, 'Cadeira adutora', 3, 12, 15, FALSE, 90, 'Fundamental para dar largura visual à coxa.'),
    (w_qua, 5, 'Panturrilha no Leg Press ou em pé (joelho estendido)', 4, 10, 15, FALSE, 90, 'Pausa obrigatória de 2 segundos no alongamento máximo embaixo para eliminar impulso do tendão.'),
    (w_qua, 6, 'Abdominal supra na polia', 3, 12, 15, FALSE, 90, 'Enrolamento completo do tronco sem puxar o pescoço.');

    -- QUINTA-FEIRA: Upper B
    INSERT INTO public.workouts (id, user_id, is_system_template, day_of_week, slug, title, focus, estimated_duration_min, is_optional, is_upper_body)
    VALUES (w_qui, NULL, TRUE, 4, 'upper-b', 'Upper B', 'V-Taper Unilateral + Cabeça Longa do Braço', 65, FALSE, TRUE);

    INSERT INTO public.exercises (workout_id, order_index, name, default_sets, min_reps, max_reps, is_compound, rest_seconds, execution_notes) VALUES
    (w_qui, 1, 'Puxada unilateral na polia alta (joelho apoiado ou banco)', 3, 10, 12, TRUE, 150, 'Liberdade total de rotação para o ombro não doer.'),
    (w_qui, 2, 'Supino reto na máquina ou com halteres', 3, 8, 12, TRUE, 150, 'Escápulas retraídas, pegada firme sem hiperextensão de punho.'),
    (w_qui, 3, 'Remada apoiada no peito (máquina ou banco inclinado c/ halteres)', 3, 10, 12, TRUE, 150, 'Elimina fadiga lombar antes do treino de perna de sexta.'),
    (w_qui, 4, 'Desenvolvimento com halteres (banco a 75–80°)', 3, 8, 12, TRUE, 150, 'Cotovelos apontando levemente para frente, nunca totalmente abertos na linha das orelhas.'),
    (w_qui, 5, 'Elevação lateral na polia', 3, 12, 15, FALSE, 90, 'Tensão contínua desde a base do movimento.'),
    (w_qui, 6, 'Rosca inclinada com halteres (banco a 45–60°)', 3, 10, 12, FALSE, 90, 'Trabalha cabeça longa do bíceps em alongamento — carga moderada e controle total na descida.'),
    (w_qui, 7, 'Tríceps francês na polia baixa/média com corda', 3, 12, 15, FALSE, 90, 'O cabo mantém tensão constante sem dar tranco no cotovelo no fundo.');

    -- SEXTA-FEIRA: Lower B
    INSERT INTO public.workouts (id, user_id, is_system_template, day_of_week, slug, title, focus, estimated_duration_min, is_optional, is_upper_body)
    VALUES (w_sex, NULL, TRUE, 5, 'lower-b', 'Lower B', 'Cadeia Posterior & Largura Geral', 60, FALSE, FALSE);

    INSERT INTO public.exercises (workout_id, order_index, name, default_sets, min_reps, max_reps, is_compound, rest_seconds, execution_notes) VALUES
    (w_sex, 1, 'Levantamento Terra Romeno (RDL) com halteres ou barra', 3, 8, 10, TRUE, 180, 'Pare 2 reps antes da falha; desça apenas até o quadril parar de ir para trás.'),
    (w_sex, 2, 'Leg Press 45°', 3, 10, 12, TRUE, 180, 'Pés na largura dos ombros, altura média-baixa, amplitude máxima sem tirar o quadril do banco.'),
    (w_sex, 3, 'Cadeira flexora', 3, 10, 12, FALSE, 90, 'Pico de contração de 1 segundo.'),
    (w_sex, 4, 'Cadeira extensora', 2, 12, 15, FALSE, 90, 'Cadência suave de 2-3s na descida.'),
    (w_sex, 5, 'Panturrilha sentado (ou no Leg Press)', 3, 12, 20, FALSE, 90, 'Pausa obrigatória de 2 segundos no alongamento.'),
    (w_sex, 6, 'Elevação de pernas no apoio ou banco', 3, 12, 15, FALSE, 90, 'Eleve o quadril no final da subida para máxima ativação infra-abdominal.');

    -- SÁBADO: Upper C
    INSERT INTO public.workouts (id, user_id, is_system_template, day_of_week, slug, title, focus, estimated_duration_min, is_optional, is_upper_body)
    VALUES (w_sab, NULL, TRUE, 6, 'upper-c', 'Upper C', 'Especialização Ombros 3D & Braços', 55, FALSE, TRUE);

    INSERT INTO public.exercises (workout_id, order_index, name, default_sets, min_reps, max_reps, is_compound, rest_seconds, execution_notes) VALUES
    (w_sab, 1, 'Elevação lateral na máquina ou com halteres (sentado)', 4, 12, 15, FALSE, 90, 'Isola deltoides laterais sem embalo de tronco.'),
    (w_sab, 2, 'Rosca martelo com halteres (alternada ou simultânea)', 4, 10, 12, FALSE, 90, 'Constrói espessura lateral do braço e antebraço.'),
    (w_sab, 3, 'Mergulho na máquina (ou Supino fechado no Smith)', 3, 8, 12, TRUE, 150, 'Construtor pesado de massa geral no tríceps com alta estabilidade.'),
    (w_sab, 4, 'Rosca Scott na máquina ou banco inclinado', 3, 10, 12, FALSE, 90, 'Não estenda o cotovelo violentamente no fundo; pare um pouco antes do travamento articular.'),
    (w_sab, 5, 'Tríceps corda na polia (abrindo a corda no final)', 3, 12, 15, FALSE, 90, 'Abertura total dos punhos na extensão.'),
    (w_sab, 6, 'Crucifixo inverso com halteres (peito apoiado no banco inclinado)', 3, 12, 15, FALSE, 90, 'Foco em estabilidade escapular e posterior de ombro.');
END $$;
