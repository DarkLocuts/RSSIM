---
name: frontend_development_plan
description: Convert Frontend Design System decisions into an explicit implementation plan.
---

# Frontend Development Plan

## Goal
Translate approved design decisions into a concrete, step-by-step implementation plan
without writing final code.

## Allowed Tools
- Read Frontend Development Rules
- Read Next-Light references
- Read frontend source files
- Inspect module structure

## Steps
1. Identify files to be created or modified.
2. Define execution flow and data flow.
3. Validate the plan against Frontend Development Rules.
4. Produce api-schemas.artifact.json and validate it against the API schema.
5. Include plans.artifact.json as a required artifact.

## Forbidden Actions
- Writing production-ready code
- Changing architectural decisions
- Introducing new patterns without justification
- Writing frontend-specific logic

## Output
Produce a structured implementation plan containing:
- affected_files
- execution_flow
- dependency_notes
- risk_points

## Artifacts
- .agent/artifacts/plans.artifact.json
- .agent/artifacts/api-schemas.artifact.json
