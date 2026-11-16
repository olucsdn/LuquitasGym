// Repositório e Gerenciador de Autenticação Segura — LuquitasGym

const USERS_STORAGE_KEY = 'luquitasgym_registered_users';
const CURRENT_SESSION_KEY = 'luquitasgym_auth_session';

// Conta oficial do Dono pré-registrada no núcleo do sistema
export const OWNER_ACCOUNT = {
  id: 'owner-luquitas-001',
  username: 'luquitas',
  email: 'luquitas@luquitasgym.com',
  password: 'eusouodono',
  display_name: 'Lucas (Dono)',
  role: 'admin'
};

/**
 * Inicializa e recupera a lista de usuários cadastrados
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const users = raw ? JSON.parse(raw) : [];
    
    // Garante que a conta do Dono sempre exista no banco local
    const hasOwner = users.some(u => u.username === OWNER_ACCOUNT.username || u.email === OWNER_ACCOUNT.email);
    if (!hasOwner) {
      users.unshift(OWNER_ACCOUNT);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  } catch (e) {
    console.error('Erro ao ler usuários registrados:', e);
    return [OWNER_ACCOUNT];
  }
}

/**
 * Autentica usuário com validação estrita de credenciais
 * @param {string} identifier - Nome de usuário ou e-mail
 * @param {string} password - Senha digitada
 */
export function authenticateLocal(identifier, password) {
  const cleanId = String(identifier || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanId || !cleanPass) {
    throw new Error('Informe o usuário/e-mail e a senha.');
  }

  const users = getRegisteredUsers();
  
  // Procura por username ou email
  const user = users.find(u => 
    (u.username && u.username.toLowerCase() === cleanId) || 
    (u.email && u.email.toLowerCase() === cleanId)
  );

  if (!user || user.password !== cleanPass) {
    throw new Error('Usuário ou senha incorretos. Caso ainda não tenha conta, clique em "Criar Conta".');
  }

  // Cria objeto de sessão autenticado
  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    user_metadata: {
      display_name: user.display_name,
      role: user.role
    }
  };

  // Salva sessão ativa
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

  // Verifica se já existe
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

  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Recupera sessão atualmente logada (se existir)
 */
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Remove sessão ativa ao deslogar
 */
export function clearStoredSession() {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (e) {
    // Ignora
  }
}
