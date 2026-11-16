# CREDENCIAIS DO DONO — LUQUITASGYM

Documentação oficial e segura da conta administrativa master pré-configurada no sistema.

---

### Acesso do Administrador / Dono

| Campo | Valor |
| :--- | :--- |
| **Identificador (User)** | `luquitas` |
| **E-mail Alternativo** | `luquitas@luquitasgym.com` |
| **Senha (Password)** | `eusouodono` |
| **Cargo / Papel** | `admin` (Dono & Criador) |
| **Nome Exibido** | `Lucas (Dono)` |

---

### Regras de Acesso e Segurança
1. **Obrigatoriedade de Login**: Qualquer visitante ou usuário deve possuir ou criar uma conta antes de acessar o dashboard e os treinos. O bypass de convidado não autenticado foi completamente desativado.
2. **Persistência Imediata**: A conta do dono está gravada e inicializada em `src/lib/authStore.js` (`OWNER_ACCOUNT`).
3. **Novos Usuários**: Podem se cadastrar a qualquer momento através da aba **Criar Conta** na tela de login.
