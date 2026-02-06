---
id: 1
title: "Fix JSON Parsing Error in API Client"
stage: "general"
date_iso: "2026-02-05"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "user"
command: "fix-json-parsing-error"
labels: ["bug-fix", "frontend", "api-client", "json-parsing"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "/mnt/e/Hackathon-2/Todo-Full-Stack-Web-App/frontend/lib/api.ts"
tests_yaml: []
---

# Fix JSON Parsing Error in API Client

## Summary
Fixed a JSON parsing error that occurred when the API client tried to parse non-JSON responses from the backend, particularly error responses like "Internal Server Error" that weren't in JSON format.

## Problem
The frontend API client (`frontend/lib/api.ts`) was attempting to parse all responses as JSON using `response.json()`, even when the server returned HTML error pages or other non-JSON content. This caused a "SyntaxError: Unexpected token 'I'" when encountering responses starting with "Internal Server Error".

## Solution
Updated the `apiRequest` function in `frontend/lib/api.ts` to:
1. Check the Content-Type header before attempting to parse JSON
2. Safely handle both error and success responses that may not be in JSON format
3. Provide appropriate fallback error handling for non-JSON responses

## Files Modified
- `frontend/lib/api.ts`: Updated response handling to safely parse JSON only when appropriate

## Changes Made
- Added content-type checking before calling `response.json()`
- Implemented fallback for non-JSON error responses using `response.text()`
- Added fallback for non-JSON success responses with warning logging

## Testing
The fix ensures that the API client gracefully handles both JSON and non-JSON responses from the backend without throwing parsing errors.

## PROMPT_TEXT
error occur solve it:## Error Type
Console SyntaxError

## Error Message
Unexpected token 'I', "Internal S"... is not valid JSON

Next.js version: 16.1.6 (Turbopack)

## RESPONSE_TEXT
I'll help you solve this JSON parsing error. The error indicates that there's an unexpected token 'I' at the beginning of what should be a JSON string, suggesting the string starts with "Internal S" which is not valid JSON.

The issue was in the frontend API client (`frontend/lib/api.ts`) where the code was attempting to parse all responses as JSON without checking if they were actually in JSON format. I've fixed this by:

1. Adding content-type header checking before calling `response.json()`
2. Implementing safe fallbacks for both error and success responses that aren't in JSON format
3. Using `response.text()` as a fallback and providing appropriate error messages

The fix ensures that when the backend returns non-JSON responses (like HTML error pages), the frontend won't crash with a JSON parsing error.