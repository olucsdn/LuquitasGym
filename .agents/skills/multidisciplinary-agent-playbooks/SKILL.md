---
name: multidisciplinary-agent-playbooks
description: Modular multidisciplinary playbooks across software architecture, executive leadership (CTO/CISO), compliance, and Python stdlib-only deterministic CLI scripts.
author: Alireza Rezvani
repository: https://github.com/alirezarezvani/claude-skills
version: 1.0
---

> 📌 **PIPELINE MARKER — FASE 5: REVISÃO DE SEGURANÇA & ARQUITETURA**
> *Posição no Fluxo:* Auditoria final OWASP Top 10, sanitização de credenciais e conformidade.
> *Guia Mestre de Orquestração:* Consulte [AGENTS.md](../AGENTS.md) para ordem de execução e precedência.

# Multidisciplinary Agent Playbooks & Modular Architecture

> "Skills should not be monolithic text dumps. This framework provides a modular 4-layer skill architecture (Playbook + Scripts + References + Assets), multidisciplinary C-level advisory modules, and portable Python standard-library CLI tools that run anywhere with zero pip dependencies."

---

## 1. The 4-Layer Modular Skill Architecture

Every production agent skill must be organized into four distinct, self-contained layers to prevent context window bloat:

```text
skill-name/
├── SKILL.md         # Layer 1: The Playbook (Rules, decision trees, workflow steps)
├── scripts/         # Layer 2: Deterministic CLI Helpers (Pure Python stdlib, zero pip)
├── references/      # Layer 3: Deep Domain Knowledge (Cheat-sheets, specs, loaded on demand)
└── assets/          # Layer 4: Output Scaffolding (Boilerplates, config files, templates)
```

### Layer 1: The Playbook (`SKILL.md`)
Contains the workflow, triggering conditions, edge-case heuristics, and step-by-step instructions.

### Layer 2: Deterministic Helpers (`scripts/`)
Executable tools written in pure **Python standard library** (using only `sys`, `json`, `pathlib`, `re`, `subprocess`, `ast`).
* **Why stdlib-only?** Never requires `pip install`, never fails due to incompatible dependencies, executes in milliseconds, and works across Windows, macOS, and Linux out-of-the-box.

### Layer 3: Deep Domain Knowledge (`references/`)
Loaded dynamically only when the task requires specialized domain expertise (e.g., specific regulatory checklists or cryptography constants).

### Layer 4: Templates & Boilerplates (`assets/`)
Standardized skeletons for ADRs, pull request templates, or Dockerfiles.

---

## 2. Core Domain Playbooks

### Domain A: CTO & Software Architecture Review
When reviewing or designing system architecture:
1. **Coupling & Cohesion Analysis:**
   - Are modules separated by clear boundaries?
   - Can a subsystem be rewritten or replaced without rippling changes throughout the codebase?
2. **Failure Domain Isolation:**
   - What happens when a downstream service (database, third-party API) fails?
   - Are circuit breakers, timeouts, and fallbacks explicitly defined?
3. **Data Consistency & Concurrency:**
   - Are database transactions atomic?
   - Are race conditions handled using optimistic locking, idempotency keys, or queues?

### Domain B: CISO & Security Operations (SecOps)
Enforces a continuous security posture:
1. **OWASP Top 10 Hardening:**
   - **Injection:** Parameterized SQL queries only. Never concatenate raw strings into SQL, shell commands, or HTML templates.
   - **Broken Access Control:** Validate user ownership and role authorization at the data query level, not just at route entrypoints.
   - **Cryptographic Failures:** Passwords hashed with bcrypt/Argon2id; secrets loaded from environment variables, never hardcoded.
2. **Credential Sanitization:**
   - Automated scan of git diffs before committing to catch `.env`, API keys (`AKIA...`, `sk_live_...`), and private SSH certificates.

### Domain C: Regulatory & Compliance Verification
Checklist for data privacy and compliance:
* **GDPR / LGPD:**
  - Data minimization (do not collect unnecessary fields).
  - Explicit consent tracking and right-to-be-forgotten deletion workflows.
  - Audit logging for all PII data access.

---

## 3. The Python Stdlib CLI Pattern (Code Template)

When agents need to perform repetitive verification (such as scanning code complexity or parsing configs), provide small, standalone stdlib scripts:

```python
#!/usr/bin/env python3
"""
scripts/verify_complexity.py - Stdlib-only AST analyzer
Calculates function complexity with zero third-party dependencies.
"""
import ast
import sys
from pathlib import Path

def analyze_file(filepath: Path) -> list:
    issues = []
    tree = ast.parse(filepath.read_text(encoding="utf-8"), filename=str(filepath))
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            complexity = 1
            for child in ast.walk(node):
                if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                    complexity += 1
            if complexity > 10:
                issues.append(f"{filepath}:{node.lineno} - Function '{node.name}' has cyclomatic complexity {complexity} (> 10)")
    return issues

if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    all_issues = []
    for py_file in target.rglob("*.py"):
        all_issues.extend(analyze_file(py_file))
    
    if all_issues:
        print("\n".join(all_issues))
        sys.exit(1)
    print("✅ All functions within acceptable complexity limits.")
    sys.exit(0)
```
