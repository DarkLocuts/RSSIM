---
description: Frontend Code Review
---

# Next-Light Code Review Workflow
version: 1.0.0

This workflow defines a **strict, non-destructive code review process**
for frontend projects using **Next-Light**.

The workflow ensures that **code structure, file placement,
and patterns** conform to Next-Light conventions.

---

## WORKSPACE

* Frontend Workspace: `./`
* Artifacts Directory: `.agent/artifacts`

The reviewer agent MUST NOT:

* Modify backend code
* Change feature behavior
* Expand feature scope

---

## GLOBAL RULES

* Next-Light patterns are authoritative
* Structure consistency is more important than personal preference
* Refactor scope MUST be minimal and traceable

---

## STAGE 1 — STRUCTURE ANALYSIS

### Step 1.1

Scan folder and file structure recursively.

### Step 1.2

Compare structure against Next-Light patterns:

* page placement
* component layers
* hooks and utilities

### Step 1.3

Generate structure analysis report.

Artifact:

* `.agent/artifacts/bugs.artifact.json`

Gate:

* No code changes at this stage
* Set type of bug "pattern"

---

## STAGE 2 — PATTERN & NAMING REVIEW

### Step 2.1

Analyze file naming conventions.

### Step 2.2

Analyze component responsibilities and boundaries.

### Step 2.3

Detect pattern violations:

* mixed concerns
* misplaced logic
* missing abstraction layers

Artifact:

* `.agent/artifacts/bugs.artifact.json`

Gate:

* Violations MUST be explicitly listed
* Set type of bug "pattern"

---

## STAGE 3 — CODEBASE

### Step 3.1

Analyze code base.

### Step 3.1

Analyze responsibilities and boundaries.

### Step 3.1

Detect pattern violations:

* mixed concerns
* misplaced logic
* missing abstraction layers
* codebase page has too much logic
* codebase page has too many states
* service does not use service object pattern
* does not use existing components and utilities

Artifact:

* `.agent/artifacts/bugs.artifact.json`

Gate:

* Violations MUST be explicitly listed
* Set type of bug "pattern"

---

## STAGE 3 — STRUCTURAL ALIGNMENT

### Step 3.1

Apply skill: `frontend_code_review`

### Step 3.2

Refactor code to align with Next-Light patterns:

* move files
* rename files
* split responsibilities

Rules:

* NO behavior change
* NO new features

Artifacts:
* `.agent/artifacts/bugs.artifact.json`

---

## STAGE 4 — VERIFICATION

### Step 4.1

Verify:

* all reported violations are resolved
* no new violations introduced

Artifact:

* `.agent/artifacts/bugs.artifact.json`

Gate:

* All checks MUST pass

---

## STAGE 5 — COMPLETION

The review is considered DONE when:

* Structure matches Next-Light patterns
* Naming is consistent
* No feature behavior changed
* All artifacts are generated

---

## FAILURE POLICY

* Any unresolved violation MUST be reported
* Reviewer MUST NOT silently skip issues

---

## ENFORCEMENT STATEMENT

This workflow is binding for:

* AI reviewers
* human reviewers
* automated refactor agents

Any deviation from this workflow is INVALID.