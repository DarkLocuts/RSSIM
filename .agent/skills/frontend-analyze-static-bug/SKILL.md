---
name: frontend_analyze_static_bug
description: Parses the output of static analysis tools and returns structured error reports.
---

# Frontend Analyze Static Errors

## Goal
Read the output from static analysis runners frontend and produce a structured JSON that lists:
- file paths
- error types
- error messages

## Instructions
1. Parse the static analysis output text.
2. Identify filenames, line numbers, and error messages.
3. Output a well-formed JSON with the following keys:
   - layer: "frontend"
   - issues: array of {path, line, message}

## Constraints
- Do not modify any source code.
- Only read the outputs and produce a structured report.

## Output
Produce a structured report following bugs schema containing:
- error_type
- probable_causes (with confidence)

## Artifacts
- .agent/artifacts/bugs.artifact.json