---
name: frontend_code_review
description: Code review and structural alignment skill for Next-Light frontend projects
---

# Frontend Code Review

## GOAL

* Detect files, folders, and code patterns that violate Next-Light conventions
* Normalize structure and naming to match documented Next-Light patterns
* Ensure components, hooks, and logic are placed correctly


## INPUTS

* Frontend source code under `./`
* Next-Light concept documentation on Next Light Reference
* Next-Light pattern documentation on Next Light Reference


## ALLOWED ACTIONS

* Read all frontend files
* Move files or folders to correct locations
* Rename files to match pattern conventions
* Split files when they violate size or responsibility rules
* Refactor code to follow documented Next-Light patterns


## FORBIDDEN ACTIONS

* Changing feature behavior
* Adding new features or UI flows
* Modifying backend contracts
* Introducing new architectural patterns not documented in Next-Light


## REVIEW CHECKLIST

The agent MUST analyze:

### 1. Folder Structure

* Pages are placed only in their intended layer
* Components follow base / construct / structure layering
* Hooks, utils, and services are not mixed with UI layers

### 2. File Naming

* File names are descriptive and consistent
* No ambiguous names such as `index.tsx` without context
* Prefixing or grouping is used when scale increases

### 3. Component Responsibility

* One component = one clear responsibility
* No data-fetching logic inside presentational components unless allowed

### 4. Pattern Compliance

* Magic components are used when applicable
* State handling follows Next-Light guidelines
* Side effects are explicit and localized


## DEFINITION OF DONE

This skill is complete when:

* All structural violations are resolved OR explicitly reported
* No behavior changes are introduced
* Codebase matches Next-Light patterns consistently


## ENFORCEMENT STATEMENT

This skill is binding for:

* AI code reviewers
* automated refactor agents
* human reviewers

Any refactor outside these rules is INVALID.
