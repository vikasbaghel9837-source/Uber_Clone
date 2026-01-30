# Uber Clone API Documentation

## User Endpoints

### POST /users/register

**Description:** Registers a new user in the system. Validates input, hashes the password using bcrypt, creates a new user record, and returns a JWT authentication token valid for 24 hours.

**Method:** `POST`

**Request Body:**
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

**Required Fields:**
| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `fullname.firstname` | string | Min 3 characters | User's first name |
| `fullname.lastname` | string | Optional | User's last name |
| `email` | string | Valid email format, unique | User's email address |
| `password` | string | Min 6 characters | User's password (will be hashed) |

**Example Request:**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User Registered Succesfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" }
  ]
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully registered. Returns token and user data. |
| `400` | Validation failed or missing required fields. |

**Notes:**
- Password is hashed before storage
- Token valid for 24 hours
- Email must be unique

---

### POST /users/login

**Description:** Authenticates a user by verifying email and password. Returns a JWT token for subsequent authenticated requests.

**Method:** `POST`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Required Fields:**
| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `email` | string | Valid email format | Registered email address |
| `password` | string | Min 6 characters | User's password |

**Example Request:**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com", "password": "password123" }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User Logged in Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 - Validation Error):**
```json
{ "errors": [{ "msg": "Invalid Email", "param": "email" }] }
```

**Error Response (401 - Invalid Credentials):**
```json
{ "message": "Invalid email or password" }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully authenticated. Returns JWT token. |
| `400` | Validation failed or missing required fields. |
| `401` | Invalid email or password. |

**Notes:**
- Token valid for 24 hours
- Include token in Authorization header for protected routes

---

### GET /users/profile

**Description:** Retrieves the authenticated user's profile information. Requires valid JWT token via header or cookie.

**Method:** `GET`  
**Authentication:** Required (JWT token)

**Request Header:**
```
Authorization: Bearer <jwt_token>
```
Or via cookie:
```
Cookie: token=<jwt_token>
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
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

**Error Response (401 - Unauthorized):**
```json
{ "message": "Unauthorized" }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully retrieved user profile. |
| `401` | Invalid, expired, or missing token. |

**Notes:**
- Protected endpoint - authentication required
- Token must not be blacklisted
- Password excluded from response for security

---

### GET /users/logout

**Description:** Logs out the authenticated user by blacklisting their JWT token (24-hour TTL) and clearing the authentication cookie.

**Method:** `GET`  
**Authentication:** Required

**Request Header:**
```
Authorization: Bearer <jwt_token>
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{ "message": "Logged Out successfully" }
```

**Error Response (401 - Unauthorized):**
```json
{ "message": "Unauthorized" }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully logged out. Token blacklisted. |
| `401` | Invalid or missing token. |

**Notes:**
- Token remains blacklisted for 24 hours
- Client should discard token after logout
- Must login again to continue using protected routes

---

## Captain Endpoints

### POST /captains/register

**Description:** Registers a new captain with vehicle information. Validates all inputs, hashes password, creates captain record with vehicle details, and returns JWT token.

**Method:** `POST`

**Request Body:**
```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": "number",
    "vehicleType": "string (car|motorcycle|auto)"
  }
}
```

**Required Fields:**
| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `fullname.firstname` | string | Min 3 characters | Captain's first name |
| `fullname.lastname` | string | Min 3 characters | Captain's last name |
| `email` | string | Valid email, unique | Captain's email address |
| `password` | string | Min 6 characters | Captain's password (hashed) |
| `vehicle.color` | string | Min 3 characters | Vehicle color |
| `vehicle.plate` | string | Min 3 characters | License plate number |
| `vehicle.capacity` | number | Min 1 | Passenger capacity |
| `vehicle.vehicleType` | string | car, motorcycle, auto | Vehicle type |

**Example Request:**
```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "password": "password123",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

**Error Response (400 - Captain Exists):**
```json
{ "message": "Captain Already Exists" }
```

**Error Response (401 - Validation Error):**
```json
{ "errors": [{ "msg": "Invalid Email", "param": "email" }] }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `201` | Successfully registered. Returns token and captain data. |
| `400` | Captain already exists with this email. |
| `401` | Validation failed or missing required fields. |

**Notes:**
- Password hashed before storage
- Captain status defaults to "inactive"
- All vehicle information required
- Token valid for 24 hours

---

### POST /captains/login

**Description:** Authenticates a captain by verifying email and password. Returns JWT token for accessing protected routes.

**Method:** `POST`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Required Fields:**
| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `email` | string | Valid email | Registered email address |
| `password` | string | Min 6 characters | Captain's password |

**Example Request:**
```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com", "password": "password123" }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged In Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 - Validation Error):**
```json
{ "errors": [{ "msg": "Invalid Email", "param": "email" }] }
```

**Error Response (401 - Invalid Credentials):**
```json
{ "message": "Invalid Email" }
```
or
```json
{ "message": "Invalid Password" }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully authenticated. Returns JWT token. |
| `400` | Validation failed or missing fields. |
| `401` | Invalid email or password. |

**Notes:**
- Token valid for 24 hours
- Use token for protected captain routes

---

### GET /captains/profile

**Description:** Retrieves the authenticated captain's profile including personal and vehicle information. Requires valid JWT token.

**Method:** `GET`  
**Authentication:** Required

**Request Header:**
```
Authorization: Bearer <jwt_token>
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car",
      "location": { "lat": null, "lng": null }
    },
    "createdAt": "2026-01-23T10:30:00.000Z",
    "updatedAt": "2026-01-23T10:30:00.000Z"
  }
}
```

**Error Response (401 - Unauthorized):**
```json
{ "message": "Unauthorized" }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully retrieved captain profile with vehicle info. |
| `401` | Invalid, expired, or missing token. |

**Notes:**
- Protected endpoint - authentication required
- Includes complete vehicle information
- Password excluded from response
- Token must not be blacklisted

---

### GET /captains/logout

**Description:** Logs out the authenticated captain by blacklisting their JWT token (24-hour TTL) and clearing the authentication cookie.

**Method:** `GET`  
**Authentication:** Required

**Request Header:**
```
Authorization: Bearer <jwt_token>
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout Successfull"
}
```

**Error Response (401 - Unauthorized):**
```json
{ "message": "Unauthorized" }
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Successfully logged out. Token blacklisted. |
| `401` | Invalid or missing token. |

**Notes:**
- Token remains blacklisted for 24 hours
- Captain must login again to continue
- Cookie cleared on client side

---

## General Notes

- **Authentication:** All protected endpoints require JWT token via `Authorization: Bearer <token>` header or `token` cookie
- **Tokens:** Valid for 24 hours, blacklisted tokens become invalid immediately
- **Password:** Always hashed using bcrypt (10 rounds) before storage
- **Validation:** All validation errors return 400 status code with detailed error messages
- **Unauthorized:** Missing, invalid, or blacklisted tokens return 401 status code
- **Token Blacklisting:** Uses MongoDB TTL indexes (24-hour expiration)
- **Content-Type:** All POST requests require `Content-Type: application/json` header
