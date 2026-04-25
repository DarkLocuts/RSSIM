---
name: frontend_analyze_runtime_bug
description: Analyze frontend runtime failures using browser-based observation.
---

# Frontend Analyze Runtime Error

## Goal
Identify the cause of frontend runtime errors by observing browser behavior.

## Allowed Tools
- Open integrated browser
- Navigate to specified feature paths
- Read console errors
- Inspect network requests
- Capture screenshots

## Steps
1. Open the frontend application in the browser.
2. Navigate to the failing feature path.
3. Observe:
   - Console errors
   - Network request failures
   - Broken UI states
4. Correlate observations with frontend source code.

## Forbidden Actions
- Editing backend code
- Modifying API behavior
- Performing UI redesign

## Output
Produce a structured report following bugs schema containing:
- error_type
- browser_observation
- probable_causes (with confidence)
- affected_components

## Artifacts
- .agent/artifacts/bugs.artifact.json
