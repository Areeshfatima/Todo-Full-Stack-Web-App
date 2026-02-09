---
name: full-stack-integration-validator
description: Validates full-stack integration in the Todo app with focus on JWT flow, user isolation, CORS, and end-to-end task operations
version: 1.0.0
category: validation
author: Claude Code
---

## When to Use This Skill

Use this skill when you need to:

- Validate the complete integration between frontend and backend in the Todo app
- Test JWT authentication flow from token issuance to verification
- Verify user data isolation and security boundaries
- Check CORS configuration and cross-origin request handling
- Validate end-to-end task operations (CRUD operations across the full stack)
- Ensure proper authentication token transmission between frontend and backend
- Test that users can only access their own data
- Validate API responses and error handling across the stack

## Process Steps

1. **Setup Validation Environment**: Prepare test environment with mock users and test data
2. **JWT Flow Validation**:
   - Test token issuance from authentication endpoint
   - Verify token transmission in API requests
   - Validate token verification on backend
   - Confirm user identity matching between token and request
3. **User Isolation Testing**:
   - Create multiple test users with sample tasks
   - Verify users can only access their own data
   - Test unauthorized access attempts
   - Validate proper filtering of user-specific data
4. **CORS Configuration Check**:
   - Test allowed origins configuration
   - Verify cross-origin request handling
   - Check preflight request responses
   - Validate security headers
5. **End-to-End Task Operations**:
   - Test task creation, retrieval, update, and deletion
   - Validate request/response formats
   - Check error handling and status codes
   - Verify data persistence and consistency
6. **Integration Validation**:
   - Run comprehensive integration tests
   - Validate API contract compliance
   - Check response times and performance
7. **Security Validation**:
   - Test authentication bypass attempts
   - Validate proper error responses
   - Verify sensitive data protection

## Output Format

The skill generates:

1. **Validation Report** containing:
   - Summary of validation results
   - Individual test outcomes (pass/fail)
   - Performance metrics
   - Security assessment
   - Recommendations for fixes

2. **Test Results Details**:
   - JWT flow validation results
   - User isolation test results
   - CORS configuration verification
   - Task operation validation
   - Error logs and exceptions

3. **Action Items**:
   - Issues found requiring attention
   - Recommended fixes
   - Priority levels for each issue

## Example

**Input**:
- Frontend URL: "http://localhost:3000"
- Backend API URL: "http://localhost:8000/api/v1"
- Test users: [{"email": "user1@test.com", "password": "password1"}, {"email": "user2@test.com", "password": "password2"}]
- Test tasks: [{"title": "Test task 1", "completed": False}, {"title": "Test task 2", "completed": True}]

**Generated Validation Output**:

```
Full-Stack Integration Validation Report
========================================

Environment:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api/v1
- Test Users: 2
- Start Time: 2026-02-03 10:00:00

1. JWT Flow Validation: PASSED ✓
   - Token issuance: SUCCESS
   - Token transmission: SUCCESS
   - Token verification: SUCCESS
   - User identity matching: SUCCESS
   - Response time: 120ms average

2. User Isolation: PASSED ✓
   - User 1 can access own tasks: SUCCESS
   - User 2 can access own tasks: SUCCESS
   - User 1 cannot access User 2's tasks: SUCCESS
   - User 2 cannot access User 1's tasks: SUCCESS
   - Filtering validation: SUCCESS

3. CORS Configuration: PASSED ✓
   - Allowed origins: CORRECT
   - Cross-origin requests: ALLOWED
   - Preflight requests: HANDLED
   - Security headers: PRESENT

4. Task Operations: PASSED ✓
   - Create task: SUCCESS
   - Read tasks: SUCCESS
   - Update task: SUCCESS
   - Delete task: SUCCESS
   - API contract compliance: VALID

5. Security Assessment: PASSED ✓
   - Authentication bypass attempts: BLOCKED
   - Proper error responses: CONFIRMED
   - Sensitive data protection: VALID

Summary:
- Total Tests: 24
- Passed: 24
- Failed: 0
- Skipped: 0
- Duration: 2.4s

Overall Status: PASSED ✓
No critical issues found.
```