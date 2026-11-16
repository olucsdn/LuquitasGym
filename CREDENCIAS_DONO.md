# ACESSO DO DONO & CONTA PESSOAL — LUQUITASGYM

Documentação oficial da conta administrativa pessoal pré-configurada no sistema.

---

### Acesso do Administrador / Dono

| Campo | Valor |
| :--- | :--- |
| **Identificador (User)** | `luquitas` |
| **E-mail Alternativo** | `luquitas@luquitasgym.local` |
| **Cargo / Papel** | `admin` (Dono & Criador) |
| **Nome Exibido** | `Lucas (Dono)` |
| **Modo de Acesso** | Auto-inicializado (Zero Fricção Pessoal) |

---

### Regras de Acesso e Segurança
1. **Modo Pessoal Zero Fricção**: Ao abrir o aplicativo no smartphone ou desktop, o sistema auto-inicializa a sessão pessoal do Dono (`Lucas (Dono)`) sem exigir digitação de senhas na academia.
2. **Sessão Persistente**: A sessão fica gravada no armazenamento local seguro (`luquitasgym_auth_session`).
3. **Novos Usuários / Expansão**: Caso o Dono faça logout explícito, a tela de login/cadastro é exibida permitindo alternância de contas ou novos cadastros.
