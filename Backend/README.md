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
