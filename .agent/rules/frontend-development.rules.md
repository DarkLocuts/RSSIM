---
trigger: always_on
---

# Frontend Development Rules

## Purpose

This document defines **MANDATORY frontend engineering rules** for projects using **Next-Light**.
These rules are derived directly from the **Next-Light Concept & Pattern documentation** and are intended to reflect how Next-Light is **actually designed to be used**.

These rules override:

* personal preferences
* generic frontend architecture assumptions
* UI/UX improvisation (human or AI)

If an implementation violates these rules → **the task MUST NOT be considered DONE**.

---

## 1. Core Principles (Binding)

### 1.1 Component-Driven First

Next-Light is a **component-first UI system**.
UI must be built by composing components, not by ad-hoc JSX duplication.

Reusable components are preferred over page-specific implementations.

---

### 1.2 Magic Component Is a Feature, Not a Shortcut

Magic Components are **intentional abstractions** provided by Next-Light to:

* reduce boilerplate
* standardize UI behavior
* accelerate CRUD and dashboard development

Magic Components are **VALID and RECOMMENDED** when they fit the use-case.

---

### 1.3 Explicit UI Behavior

All UI behavior must be **explicitly visible in code**:

* state
* side effects
* API interaction
* event handling

Hidden behavior or implicit UI logic is forbidden.

---

### 1.4 Declarative Over Imperative

UI must follow React / Next.js **declarative patterns**.
Manual DOM manipulation or imperative UI control is forbidden unless absolutely necessary.

---

## 2. Component Layering Rules

Components MUST be organized by responsibility.

### Layer Definitions

* **Base Components**
  UI primitives: Button, Input, Badge, Icon, Typography, etc.

* **Construct Components**
  Composed building blocks: ProductCard, OrderButton, TransactionStatusBadge, etc.

* **Structure Components**
  Layouts and page sections: Header, Sidebar, PageLayout, DashboardSection, Partial Page, etc.

---

## 3. Component Usage Rules

### 3.1 Magic Components First

For common UI features such as:

* TableSupervision
* FormSupervision

Magic Components **MUST** be evaluated first before creating custom implementations.

---

### 3.2 Custom Components

Custom components MAY be created only when:

* Magic Components cannot represent the UI requirement
* UX or performance requires lower-level control

Custom components MUST:

* Use smaller components in the base componen
* follow Next-Light styling and interaction conventions
* be clearly named and scoped

---

## 4. API Interaction & Data Fetching

API interaction MUST follow Next-Light patterns and utilities when available.

### Rules

* Fetch logic must be centralized
* Reusable API logic must not be duplicated
* Loading and error states must be handled explicitly

Custom fetch logic is allowed only when:

* Next-Light utilities cannot satisfy the requirement
* the reason is clear and documented

---

## 5. State Management Rules

### Local State

Local UI state should remain inside the component when possible.

### Shared State

Shared state MAY use:

* Next-Light state helpers
* React Context
* Reducer-based patterns

### Forbidden

* Unstructured global state
* Excessive prop drilling when shared state is more appropriate

---

## 6. Structural Consistency

All frontend modules MUST follow a consistent structure across the codebase.

### Structure

```
/app
    /(modul_name)
        /_services
        /_constructs
        /_structures
        page.tsx
    layout.tsx
/components
/utils
/styles
```

---

## 7. Folder & File Naming Rules

As the codebase grows, **readability is more important than brevity**.

### Rules

* Use explicit, descriptive file names
* Use prefixes or grouping when modules increase

### Examples

* `UserTable.component.tsx`
* `ProductForm.component.tsx`
* `OrderListSection.component.tsx`

### Violation If

* Files are named ambiguously (`Form.tsx`, `Table.tsx`)
* Component responsibility cannot be inferred from the file name

---

## 8. Styling Rules

Styling must be:

* consistent
* maintainable
* aligned with the UI system

### Rules

* Use a single styling approach consistently (e.g. Tailwind, CSS Modules)
* Avoid scattered inline styles
* Styling must not encode business logic

---

## 9. Error, Loading, and Empty States

Any UI interacting with API data MUST handle:

* loading states
* error states
* empty states

Magic Components do not remove this responsibility.

---

## 10. Performance Rules

Frontend performance is a first-class concern.

### Rules

* Use lazy loading for heavy pages or components
* Use dynamic imports where appropriate
* Use Next.js optimizations (Image, caching, SSR/CSR balance)

### Forbidden

* Unnecessary re-renders
* Heavy logic inside render paths

---

## 11. Generator & Blueprint Rules

Next-Light generators and blueprints are **acceleration tools**.

### Rules

* Generated code MAY be modified
* Modifications MUST be intentional and readable
* Structural changes SHOULD be reflected in the blueprint when permanent

---

## 12. Frontend Code Modification Rules

### Writable Paths (agent MAY modify)
- app/**
- components/construct.components/**
- components/structure.components/**
- context/**
- styles/**
- schema/**
- blueprints/**

The agent is allowed to directly apply fixes ONLY inside these paths.

---

### Read-Only Paths (agent MUST NOT modify)

The agent MAY read these paths, but MUST NOT edit them:

- utils/**
- components/base.components/**

If a fix requires changes inside any read-only path:
- DO NOT modify the file
- Explicitly mention the required change in `explanation.md`
- Mark the bug as `fix_but_need_human`

---

## 13. Manual Code Policy

Manual implementation is allowed when:

* Magic Components cannot express the requirement
* Fine-grained UX or performance control is needed

Manual code MUST:

* remain explicit
* follow Next-Light patterns
* avoid hidden abstractions
* services must use the service object pattern
* if utilities and components already exist, you must use the existing ones.
* the code page should not have too much logic
* the code page should not have too many states

---

## 14. Definition of DONE

A frontend task is considered **DONE** only when:

* Next-Light patterns are followed where applicable
* UI behavior is explicit and readable
* Components are properly layered
* No unnecessary duplication exists
* Naming and structure are consistent

---

## 14. Advanced References

For patterns not explicitly covered here, refer to:

* Next-Light Concept: [https://light.sejedigital.com/next/concept](https://light.sejedigital.com/next/concept)
* Next-Light Pattern: [https://light.sejedigital.com/next/pattern](https://light.sejedigital.com/next/pattern)
* Existing project codebase

---

## 15. Enforcement Statement

This document binds:

* frontend developers
* AI agents
* code generators
* reviewers

No exception is allowed without explicit revision of this document.