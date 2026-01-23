# Uber Clone API Documentation

## POST /users/register

### Description
This endpoint registers a new user in the system. It validates the user input, hashes the password, creates a new user record, and returns an authentication token.

### HTTP Method
`POST`

#### Request Body
The request body must be a JSON object with the following fields:

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

#### Required Fields

| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `fullname.firstname` | string | Min 3 characters | User's first name |
| `fullname.lastname` | string | Optional | User's last name |
| `email` | string | Valid email format | User's email address |
| `password` | string | Min 6 characters | User's password (will be hashed) |

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User Registered Succesfully",
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "hashed_password"
  }
}
```

**Status Code:** `200 OK`

#### Error Response (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

### Validation Errors

The following validation errors may be returned:

| Error | Message | Condition |
|-------|---------|-----------|
| Invalid Email | "Invalid Email" | Email format is not valid |
| Invalid Firstname | "First name must be atleast 3 characters long" | Firstname is less than 3 characters |
| Invalid Password | "Password must be atleast 6 characters long" | Password is less than 6 characters |
| Missing Fields | "All Fields are required" | firstname, email, or password is missing |

### Example Request

```bash
curl -X POST http://localhost:PORT/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example Response (Success)

```json
{
  "success": true,
  "message": "User Registered Succesfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "$2b$10$..."
  }
}
```

### Example Response (Error)

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Status Codes

| Code | Description |
|------|-------------|
| `200` | User successfully registered. Returns token and user data. |
| `400` | Bad request. Validation failed or missing required fields. |

### Notes
- The password is hashed before being stored in the database.
- A JWT authentication token is returned upon successful registration.
- The token can be used for subsequent authenticated requests.
- The `lastname` field is optional but recommended.

---

## POST /users/login

### Description
This endpoint authenticates a user and returns a JWT authentication token. It validates the user's credentials (email and password), verifies the password, and issues a token for subsequent authenticated requests.

### HTTP Method
`POST`

#### Request Body
The request body must be a JSON object with the following fields:

```json
{
  "email": "string",
  "password": "string"
}
```

#### Required Fields

| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `email` | string | Valid email format | User's registered email address |
| `password` | string | Min 6 characters | User's password |

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User Logged in Successfully",
  "token": "jwt_token_string"
}
```

**Status Code:** `200 OK`

#### Error Response (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

#### Error Response (401 Unauthorized)
```json
{
  "message": "Invalid email or password"
}
```

**Status Code:** `401 Unauthorized`

### Validation Errors

The following validation errors may be returned:

| Error | Message | Condition | Status Code |
|-------|---------|-----------|-------------|
| Invalid Email | "Invalid Email" | Email format is not valid | 400 |
| Invalid Password | "Password must be atleast 6 characters long" | Password is less than 6 characters | 400 |
| Invalid Credentials | "Invalid email or password" | Email not found in database | 401 |
| Wrong Password | "Invalid password" | Email exists but password doesn't match | 401 |

### Example Request

```bash
curl -X POST http://localhost:PORT/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example Response (Success)

```json
{
  "success": true,
  "message": "User Logged in Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example Response (Invalid Credentials)

```json
{
  "message": "Invalid email or password"
}
```

### Example Response (Validation Error)

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Status Codes

| Code | Description |
|------|-------------|
| `200` | User successfully authenticated. Returns JWT token. |
| `400` | Bad request. Validation failed or missing required fields. |
| `401` | Unauthorized. Invalid email or password. |

### Notes
- The password is compared against the hashed password stored in the database.
- A JWT authentication token is returned upon successful login.
- This token should be included in the Authorization header for subsequent authenticated requests.
- Both email and password must be correct to successfully authenticate.
- The response does not include user data for security purposes.

---

## GET /users/profile

### Description
This endpoint retrieves the authenticated user's profile information. It requires a valid JWT token for authentication. The token can be passed via cookies or the Authorization header.

### HTTP Method
`GET`

### Authentication
**Required:** Yes

The request must include one of the following:
- Cookie: `token=jwt_token_string`
- Header: `Authorization: Bearer jwt_token_string`

### Request Headers
```
Authorization: Bearer jwt_token_string
```

or 

```
Cookie: token=jwt_token_string
```

### Response

#### Success Response (200 OK)
```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "createdAt": "2026-01-23T10:30:00.000Z",
  "updatedAt": "2026-01-23T10:30:00.000Z"
}
```

**Status Code:** `200 OK`

#### Error Response (401 Unauthorized)
```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `401 Unauthorized`

### Error Scenarios

| Scenario | Status Code | Response |
|----------|-------------|----------|
| No token provided | 401 | `{"message": "Unauthorized"}` |
| Invalid/Expired token | 401 | `{"message": "Unauthorized"}` |
| Token blacklisted (user logged out) | 401 | `{"message": "Unauthorized"}` |
| Valid token | 200 | User profile data |

### Example Request

```bash
curl -X GET http://localhost:PORT/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Or with cookie:

```bash
curl -X GET http://localhost:PORT/users/profile \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example Response (Success)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "createdAt": "2026-01-23T10:30:00.000Z",
  "updatedAt": "2026-01-23T10:30:00.000Z"
}
```

### Example Response (Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

### Status Codes

| Code | Description |
|------|-------------|
| `200` | Successfully retrieved user profile. |
| `401` | Unauthorized. Invalid, expired, or missing token. |

### Notes
- This is a protected endpoint and requires authentication.
- The JWT token must be valid and not blacklisted.
- User data is retrieved from the authenticated user's session.
- Password is not returned in the response for security purposes.

---

## GET /users/logout

### Description
This endpoint logs out the authenticated user by blacklisting their JWT token and clearing the authentication cookie. The blacklisted token becomes invalid for future requests.

### HTTP Method
`GET`

### Authentication
**Required:** Yes

The request must include one of the following:
- Cookie: `token=jwt_token_string`
- Header: `Authorization: Bearer jwt_token_string`

### Request Headers
```
Authorization: Bearer jwt_token_string
```

or 

```
Cookie: token=jwt_token_string
```

### Response

#### Success Response (200 OK)
```json
{
  "message": "Logged Out successfully"
}
```

**Status Code:** `200 OK`

#### Error Response (401 Unauthorized)
```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `401 Unauthorized`

### Error Scenarios

| Scenario | Status Code | Response |
|----------|-------------|----------|
| No token provided | 401 | `{"message": "Unauthorized"}` |
| Invalid/Expired token | 401 | `{"message": "Unauthorized"}` |
| Valid token | 200 | `{"message": "Logged Out successfully"}` |

### Example Request

```bash
curl -X GET http://localhost:PORT/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Or with cookie:

```bash
curl -X GET http://localhost:PORT/users/logout \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example Response (Success)

```json
{
  "message": "Logged Out successfully"
}
```

### Example Response (Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

### Status Codes

| Code | Description |
|------|-------------|
| `200` | Successfully logged out. Token blacklisted. |
| `401` | Unauthorized. Invalid, expired, or missing token. |

### Notes
- This is a protected endpoint and requires authentication.
- The JWT token is added to a blacklist and becomes invalid for subsequent requests.
- The authentication cookie is cleared from the client.
- The token remains blacklisted for 24 hours in the database (TTL: 86400 seconds).
- After logout, the user must login again to get a new token.
- Both methods of token transmission (cookie and header) are supported.
