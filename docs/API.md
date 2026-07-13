# interQ REST API Specification

This document details every REST endpoint in the **interQ** backend. All routes are prefixed with `/api/v1`.

---

## 1. Authentication Module

### 1.1 `POST /api/v1/auth/sync`
Synchronizes the user account from Firebase Authentication into PostgreSQL upon login or registration.

- **Method**: `POST`
- **URL**: `/api/v1/auth/sync`
- **Purpose**: Upserts the user record in PostgreSQL after Firebase Authentication.
- **Authentication Required**: Yes
- **Authorization**: Valid Firebase ID Token
- **Headers**:
  - `Authorization: Bearer <firebase_id_token>`
  - `Content-Type: application/json`
- **Path Params**: None
- **Query Params**: None
- **Request Body**:
  ```json
  {
    "email": "candidate@interq.io",
    "name": "Alex Mercer"
  }
  ```
- **Validation Rules**:
  - `email`: Required, valid email string, max 255 chars.
  - `name`: Required, string, max 100 chars.
- **Response**:
  - **Status Code**: `200 OK` (User already exists) or `201 Created` (New user created)
  - **Response Body**:
    ```json
    {
      "id": "firebase-uid-12345",
      "email": "candidate@interq.io",
      "name": "Alex Mercer",
      "role": "user",
      "reputation": 0,
      "createdAt": "2026-07-10T12:00:00.000Z"
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Token expired or invalid.
  - `400 Bad Request`: Email/name validation failed.
- **Rate Limits**: 10 calls per minute per IP.
- **Pagination / Caching**: None.

---

## 2. Questions Module

### 2.1 `GET /api/v1/questions`
Retrieves a paginated list of active questions.

- **Method**: `GET`
- **URL**: `/api/v1/questions`
- **Purpose**: Fetch questions for browse feeds, filterable by company, difficulty, tag, and sort.
- **Authentication Required**: No (Guests allowed)
- **Authorization**: None
- **Headers**:
  - `Content-Type: application/json`
- **Path Params**: None
- **Query Params**:
  - `page`: Integer, default `1`.
  - `limit`: Integer, default `10`, max `50`.
  - `companyId`: UUID string (optional).
  - `difficulty`: String: `Easy`, `Medium`, `Hard` (optional).
  - `tag`: String (optional).
  - `sort`: String: `recent`, `popular`, `validated`. Default `recent`.
- **Request Body**: None
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "data": [
        {
          "id": "8a32b21c-4b53-4d6a-8bfe-9e1261ea4512",
          "title": "Design a distributed rate limiter",
          "role": "Staff Software Engineer",
          "difficulty": "Hard",
          "tags": ["System Design", "Redis"],
          "askedYear": 2026,
          "company": {
            "id": "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
            "name": "Google",
            "logoUrl": "https://cdn.interq.io/google.png"
          },
          "upvotes": 42,
          "askedCount": 154,
          "answersCount": 3,
          "createdAt": "2026-07-09T18:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "totalItems": 48
      }
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Invalid pagination parameters.
- **Rate Limits**: 60 calls per minute per IP.
- **Caching**: Results matching parameters are cached in Redis for 10 minutes (`TTL: 600s`).

---

### 2.2 `POST /api/v1/questions`
Creates a new interview question.

- **Method**: `POST`
- **URL**: `/api/v1/questions`
- **Purpose**: Submit a new interview question.
- **Authentication Required**: Yes
- **Authorization**: Authenticated User or Admin
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Merge K Sorted Lists containing millions of elements",
    "content": "Detailed problem constraints...",
    "role": "Software Engineer II",
    "companyId": "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
    "experienceLevel": "mid",
    "interviewRound": "coding",
    "askedYear": 2026,
    "difficulty": "Medium",
    "tags": ["Algorithms", "Heap"]
  }
  ```
- **Validation Rules**:
  - `title`: String, min 10, max 255 chars.
  - `content`: String, min 50 chars.
  - `askedYear`: Integer, between 2000 and current_year + 1.
  - `difficulty`: Must be `Easy`, `Medium`, or `Hard`.
  - `experienceLevel`: Must be `entry`, `mid`, `senior`, or `staff`.
- **Response**:
  - **Status Code**: `201 Created`
  - **Response Body**:
    ```json
    {
      "id": "9b12c34d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "title": "Merge K Sorted Lists containing millions of elements",
      "createdAt": "2026-07-10T12:30:00.000Z"
    }
    ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Triggered duplicate warning (client can bypass by supplying query param `?bypass=true`).
- **Rate Limits**: 5 questions per hour per user.

---

### 2.3 `GET /api/v1/questions/:id`
Retrieves detailed metadata for a single question.

- **Method**: `GET`
- **URL**: `/api/v1/questions/8a32b21c-4b53-4d6a-8bfe-9e1261ea4512`
- **Purpose**: Get question details.
- **Authentication Required**: No (Guests allowed)
- **Authorization**: None (Guests get answers count but no answers data)
- **Headers**:
  - `Authorization: Bearer <token>` (Optional)
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "id": "8a32b21c-4b53-4d6a-8bfe-9e1261ea4512",
      "title": "Design a distributed rate limiter",
      "content": "Detailed constraints statement...",
      "role": "Staff Software Engineer",
      "difficulty": "Hard",
      "tags": ["System Design", "Redis"],
      "askedYear": 2026,
      "company": {
        "id": "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
        "name": "Google",
        "logoUrl": "https://cdn.interq.io/google.png"
      },
      "upvotes": 42,
      "askedCount": 154,
      "isBookmarked": false,
      "isValidated": false,
      "createdAt": "2026-07-09T18:00:00.000Z"
    }
    ```

---

### 2.4 `PATCH /api/v1/questions/:id`
Updates an existing question.

- **Method**: `PATCH`
- **URL**: `/api/v1/questions/:id`
- **Purpose**: Modify question details. Only the author or an admin can update.
- **Authentication Required**: Yes
- **Authorization**: Owner or Admin
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**: `{ "success": true }`
  - **Error Codes**: `403 Forbidden` (User is not the author).

---

### 2.5 `DELETE /api/v1/questions/:id`
Soft-deletes a question.

- **Method**: `DELETE`
- **URL**: `/api/v1/questions/:id`
- **Purpose**: Soft deletes a question.
- **Authentication Required**: Yes
- **Authorization**: Owner or Admin
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**: `{ "success": true, "message": "Question soft-deleted successfully" }`

---

## 3. Answers Module

### 3.1 `GET /api/v1/questions/:questionId/answers`
Retrieves answers for a question.

- **Method**: `GET`
- **URL**: `/api/v1/questions/:questionId/answers`
- **Purpose**: Fetch solution lists.
- **Authentication Required**: Yes (Guests are blocked)
- **Authorization**: Authenticated User
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "answers": [
        {
          "id": "3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d",
          "content": "Markdown solution...",
          "upvotes": 18,
          "isAccepted": true,
          "author": {
            "name": "Elena Rostova",
            "avatarUrl": "https://images.unsplash.com/..."
          },
          "createdAt": "2026-07-09T20:00:00.000Z"
        }
      ]
    }
    ```
  - **Error Codes**: `401 Unauthorized` (Guests trying to read answers).

---

### 3.2 `POST /api/v1/questions/:questionId/answers`
Submits an answer solution.

- **Method**: `POST`
- **URL**: `/api/v1/questions/:questionId/answers`
- **Purpose**: Answer a question.
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "content": "Markdown text code blocks..."
  }
  ```
- **Response**:
  - **Status Code**: `201 Created`
  - **Response Body**: `{ "id": "uuid-generated", "success": true }`

---

## 4. Votes & Validation Matches Module

### 4.1 `POST /api/v1/answers/:answerId/vote`
Toggles an upvote on a solution.

- **Method**: `POST`
- **URL**: `/api/v1/answers/:answerId/vote`
- **Purpose**: Upvote solution. Clicking twice removes the vote.
- **Authentication Required**: Yes
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "action": "added", // or "removed"
      "upvotesCount": 19
    }
    ```

---

### 4.2 `POST /api/v1/questions/:questionId/validate`
Toggles "I was asked this" validation counter.

- **Method**: `POST`
- **URL**: `/api/v1/questions/:questionId/validate`
- **Purpose**: Validates candidate matches. Clicking twice retracts match.
- **Authentication Required**: Yes
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "action": "added",
      "askedCount": 155
    }
    ```

---

## 5. Bookmarks Module

### 5.1 `POST /api/v1/questions/:questionId/bookmark`
Toggles saving a question.

- **Method**: `POST`
- **URL**: `/api/v1/questions/:questionId/bookmark`
- **Purpose**: Save for later study.
- **Authentication Required**: Yes
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "isBookmarked": true // or false
    }
    ```

---

## 6. Notifications Module

### 6.1 `GET /api/v1/notifications`
Fetches current notifications.

- **Method**: `GET`
- **URL**: `/api/v1/notifications`
- **Purpose**: Get unread alerts list.
- **Authentication Required**: Yes
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "notifications": [
        {
          "id": "1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
          "title": "New Answer",
          "message": "Alex answered your question.",
          "link": "/questions/8a32b21c",
          "read": false,
          "createdAt": "2026-07-10T12:00:00.000Z"
        }
      ]
    }
    ```

---

## 7. Search Module

### 7.1 `GET /api/v1/search`
Global search.

- **Method**: `GET`
- **URL**: `/api/v1/search`
- **Purpose**: Fast full-text querying.
- **Authentication Required**: No
- **Query Params**:
  - `q`: String (search keyword).
  - `type`: String: `all`, `questions`, `companies`. Default `all`.
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "questions": [
        {
          "id": "8a32b21c-4b53-4d6a-8bfe-9e1261ea4512",
          "title": "Design a distributed rate limiter",
          "companyName": "Google"
        }
      ],
      "companies": [
        {
          "id": "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
          "name": "Google",
          "slug": "google"
        }
      ]
    }
    ```

---

## 8. Admin Module

### 8.1 `POST /api/v1/admin/questions/merge`
Merges a duplicate question into a master thread.

- **Method**: `POST`
- **URL**: `/api/v1/admin/questions/merge`
- **Purpose**: Merge duplicate threads.
- **Authentication Required**: Yes
- **Authorization**: Admin role check
- **Request Body**:
  ```json
  {
    "sourceQuestionId": "source-duplicate-uuid",
    "targetQuestionId": "master-target-uuid"
  }
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Response Body**:
    ```json
    {
      "success": true,
      "message": "Question merged successfully"
    }
    ```
  - **Error Codes**: `403 Forbidden` (User is not an admin).
