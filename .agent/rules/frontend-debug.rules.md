---
trigger: always_on
---

# Frontend Debug Rules

These rules apply to ALL frontend analysis and fix actions.

---

## 1. Frontend Runtime Analysis Rules

### Allowed Actions
- Run frontend application
- Open browser
- Test ONLY feature paths explicitly defined in the workflow
- Observe UI, console errors, and network requests related to the tested feature

### Forbidden Actions
- Testing unrelated routes or features
- Calling backend APIs not triggered by the tested feature
- Guessing or exploring other UI paths

The agent MUST strictly limit runtime testing to the feature paths specified by the workflow.

## Static Analysis Tool Restriction Rule

- This project DOES NOT use ESLint or any linting tool.
- Static analysis is limited to:
  - TypeScript compiler check (tsc --noEmit)
- Dont use linting tools:
  - The agent MUST NOT run lint
  - The agent MUST NOT run eslint
  - The agent MUST NOT suggest installing lint tools
  - The agent MUST NOT modify configuration to enable linting

Any attempt to use linting tools MUST be treated as an invalid action.

---

## 2. Frontend Code Modification Rules

### Writable Paths (agent MAY modify)
- app/**
- components/construct.components/**
- components/structure.components/**
- context/**

The agent is allowed to directly apply fixes ONLY inside these paths.

---

### Read-Only Paths (agent MUST NOT modify)

The agent MAY read these paths, but MUST NOT edit them:

- utils/**
- components/base.components/**
- styles/**
- schema/**
- blueprints/**

If a fix requires changes inside any read-only path:
- DO NOT modify the file
- Explicitly mention the required change in `explanation.md`
- Mark the bug as `fix_but_need_human`

---

## 3. Forbidden Global Actions (Frontend)

- No refactoring across folders
- No style redesign
- No schema changes
- No architectural changes

Frontend fixes MUST be minimal and feature-scoped.

---

## 4. Enforcement

If the agent:
- Modifies files outside writable paths
- Tests features not listed in workflow
- Applies speculative fixes

→ The fix MUST be considered invalid and escalated to human review.