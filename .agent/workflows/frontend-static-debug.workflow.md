---
description: Frontend Static Debug Workflow
---

# Frontend Static Debug Workflow
Version: 1.0.0

This workflow defines a strict, feature-driven, and schema-governed
debugging process for a frontend project with Next-Light.

The agent MUST obey workspace boundaries, feature scope, and artifact rules.
No inference, exploration, or architectural changes are allowed.

---

## WORKSPACE DIRECTORY MAPPING

This project contains multiple bounded workspaces.

### Frontend Workspace
- Root directory: ./
- Purpose: app, components, state, interaction, presentation logic

### Agent Artifacts (Shared)
- Contents:
  - .agent/artifacts/debug-features.artifact.json (HUMAN-OWNED, read-only)
  - .agent/artifacts/bugs.artifacts.json (shared source of truth)

The agent MUST NOT:
* Modify files outside `./`
* Modify backend code
* Invent APIs or backend logic
* Modify debug-features.artifact.json

---

## GLOBAL CONSTRAINTS

- feature.schema.json defines WHAT features exist
- bugs.artifact.json defines WHAT is broken
- The agent MUST NOT invent features, actions, or APIs
- All fixes MUST be minimal and scoped
- All fixes MUST produce required artifacts:
  - diff.patch
  - explanation.md

---

## ARTIFACT WRITE PROTOCOL

When writing or updating any artifact file:

1. The agent MUST follow the corresponding JSON schema:
   - .agent/artifacts/bugs.artifact.json → schemas/bugs.schema.json

2. The agent MUST ensure field names, nesting, and data types
   exactly match the schema definition.

3. If the agent is unable to guarantee schema validity:
   - DO NOT write the artifact
   - Report schema mismatch
   - Mark related bug as `need_human`

4. Any invalid artifact write MUST abort the workflow immediately.

---

## STAGE 1 — FRONTEND STATIC DEBUG

### Step 1.1
Run frontend static analysis ONLY inside ./
- Apply skill: `frontend_analyze_static_bug`

### Step 1.2
If static errors are found:
- Append new entries to `.agent/artifacts/bugs.artifact.json`
- Set:
  - layer = "frontend"
  - type = "static_error"
  - status = "open"
  - source = "ai"

### Step 1.3
For each OPEN frontend static bug:
- Apply skill: `frontend_fix_static_bug`
- If fix succeeds:
  - Update bug status → `fix`
  - Record modified file and line
- If fix requires restricted path:
  - Update bug status → `fix_but_need_human`

---


## STAGE 2 — FINALIZATION

Workspace: ./.agent/artifacts

### Step 7.1
For all bugs marked `fix`:
- Verify required artifacts exist:
  - diff.patch
  - explanation.md

### Step 7.2
Leave bugs with status:
- `fix_but_need_human`
- `need_human`

These require explicit human intervention.

The agent MUST NOT mark bugs as done without verification.

---

## END OF WORKFLOW