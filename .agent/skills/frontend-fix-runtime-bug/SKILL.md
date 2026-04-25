---
name: frontend_fix_runtime_bug
description: Apply minimal runtime bug fixes in frontend code.
---

# Frontend Fix Runtime Bug

## Goal
Given an analysis of a frontend runtime problem, apply minimal safe edits that resolve the issue.

## Rules
- Only fix null guards, optional chaining, or basic component logic mistakes.
- Do not refactor behavior or change design patterns.

## Output
- Patch file of changes.
- Explanation of edits and why they fix the runtime issue.
