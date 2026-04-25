---
description: Frontend Development Workflow
---

# Frontend Development Workflow
version: 1.0.0

This workflow defines a **frontend planning and development**
This workflow defines a **frontend planning and development**
development process for a frontend project with Next-Light.

The agent MUST obey workspace boundaries, feature scope, and artifact rules.
No inference, exploration, or architectural changes are allowed.

This workflow assumes:

* The prompt is already clear and approved
* Feature scope is already agreed
* No design system enforcement

The agent MUST implement **only what is explicitly stated in the prompt**.

---

## WORKSPACE DIRECTORY MAPPING

### Frontend Workspace

* Root directory: `./`
* Purpose: app, components, state, interaction, API consumption

### Agent Artifacts

* Directory: `.agent/artifacts`
* Contents:

  * `plans.artifact.json`
  * `frontend-diff.patch`

The agent MUST NOT:

* Modify files outside `./`
* Modify backend code
* Invent APIs or backend logic

---

## GLOBAL CONSTRAINTS

* Prompt defines **WHAT to build**
* Existing frontend code defines **HOW it integrates**
* API usage MUST follow existing endpoints

The agent MUST NOT:

* Expand feature scope
* Add new API endpoints
* Modify backend behavior
* Perform architectural refactors

All work MUST be minimal and traceable to the prompt.

---

## ARTIFACT WRITE PROTOCOL

When writing artifacts:

1. The agent MUST follow the corresponding JSON schema:
   - .agent/artifacts/bugs.artifact.json → schemas/bugs.schema.json
   - .agent/artifacts/plans.artifact.json → schemas/plans.schema.json
   - .agent/artifacts/api-contracts.artifacts.json → schemas/api-contracts.schema.json

2. All artifacts MUST be:
   * explicit
   * deterministic
   * directly traceable to the prompt

3. The agent MUST ensure field names, nesting, and data types
   exactly match the schema definition.

4. If any ambiguity exists:

   * DO NOT implement
   * Mark as `need_human`

5. Any invalid artifact write MUST abort the workflow immediately.

---

## STAGE 1 — FRONTEND DEVELOPMENT PLANNING

### Step 1.1

Apply skill: `frontend_development_plan`

### Step 1.2

Define explicitly:

* affected pages
* affected components
* required UI states
* required user interactions
* API consumption points
* loading and error behavior

Produce artifact:

* `.agent/artifacts/plans.artifact.json`
* `.agent/artifacts/api-contracts.artifact.json`

Gate:

* Plan MUST map 1:1 with the prompt
* No assumptions or extensions allowed

---

## STAGE 2 — FRONTEND DEVELOPMENT IMPLEMENTATION

### Step 2.1

Apply skill: `frontend_development`

Rules:

* Implement ONLY what exists in the plan
* No refactor unless strictly required
* No design changes outside scope

Produce artifacts:

* `.agent/artifacts/frontend-development.patch`

---

## STAGE 3 — IMPLEMENTATION VERIFICATION

### Step 3.1

Verify:

* Feature behavior matches the prompt
* No extra functionality introduced
* No unrelated files modified

Gate:

* Any deviation MUST be marked `need_human`

---

## STAGE 4 — COMPLETION

The feature is considered **DONE (Frontend)** when:

* Planning artifact exists
* Diff is minimal and scoped
* Implementation matches the prompt
* No backend changes exist

---

## FAILURE POLICY

* Any gate failure STOPS the workflow
* Fixes MUST occur at the originating stage
* Guessing is forbidden

---

## UPDATE PLANNING STATUS

Update status and status details plans artifacts:

* `.agent/artifacts/plans.artifacts.json`


## ENFORCEMENT STATEMENT

This workflow is binding for:

* frontend agents
* human reviewers

Correct output that does not strictly follow the prompt
is considered INVALID.