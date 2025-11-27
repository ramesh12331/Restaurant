# 📘 JSON Web Token (JWT) – Complete Guide

## ⭐ What is JWT?

JWT (JSON Web Token) is a **compact**, **URL‑safe**, and **digitally signed** token used to securely transmit information between client and server.

It is widely used for **authentication** and **authorization** in modern web applications.

A JWT is made of **three parts**:

1. **Header** – algorithm & token type
2. **Payload** – user data (claims)
3. **Signature** – verifies authenticity

---

## 🔧 JWT Syntax

A typical JWT looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiIxMjM0NTYiLCJyb2xlIjoiYWRtaW4ifQ.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

Each part is **Base64URL encoded** and separated by dots (`.`).

---

## 🧩 Header Example

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

## 🧩 Payload Example

```json
{
  "vendorId": "65afbd23c09e11",
  "email": "test@example.com",
  "role": "vendor",
  "exp": 1734982400
}
```

## 🧩 Signature Example

```js
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secretKey
)
```

---

## ⚙️ How JWT Works (Flow)

1. User logs in → server verifies credentials.
2. Server creates a JWT using the secret key.
3. JWT is sent to the client.
4. Client stores token (localStorage / cookies).
5. For each request, client sends token in `Authorization: Bearer <token>`.
6. Server verifies the token and allows access.

---

## 🧪 Example Code (Node.js + Express)

### **Generate Token (Login):**

```js
const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
  expiresIn: "1h",
});
```

### **Verify Token (Middleware):**

```js
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.vendorId = decoded.vendorId;
    next();
  });
};
```

---

## 🎯 Purpose of JWT

| Purpose              | Description                         |
| -------------------- | ----------------------------------- |
| Authentication       | Validate user login securely        |
| Authorization        | Allow access to protected routes    |
| Stateless sessions   | No need to store sessions on server |
| Secure communication | Signed token prevents tampering     |

---

## 🔥 Tricks & Best Practices

* Always store the secret key in `.env`.
* Use short expiry for security: `expiresIn: "1h"`.
* Never store sensitive info inside JWT payload.
* Use middleware to protect routes.
* Prefer **Bearer Tokens** in headers.

Example Header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Summary

* JWT is a secure way to authenticate users.
* Consists of **Header + Payload + Signature**.
* Used widely in APIs and web apps.
* Easy to implement in Node.js using `jsonwebtoken`.
* Must be protected with environment variables and middleware.

---

If you want, I can add **diagrams**, **flowcharts**, or convert this into a **PDF** too!

---

# 📦 Multer, Mongoose Ref & Populate — Complete Guide

## 🧰 Multer

### ⭐ What is Multer?

Multer is a **Node.js middleware** used for handling **multipart/form-data**, which is mainly used for **file uploads**.

### 🔧 Syntax

```js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
```

### 📥 Example

```js
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('File uploaded successfully');
});
```

### 🎯 Purpose

* Upload images, PDFs, videos
* Store files locally or on cloud (S3, Cloudinary)

### 🔥 Trick

* Always validate file type using `fileFilter`
* Always store uploads outside root folder in production

---

# 🔗 Mongoose Ref & Populate

## ⭐ What is `ref` in Mongoose?

`ref` is used to **create relationships** between MongoDB collections.

Example:
Vendor → Firm (One-to-Many)

### 🔧 Syntax

```js
firm: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Firm"
}]
```

---

## ⭐ What is `populate()`?

`populate()` automatically replaces the referenced ObjectId with the **actual document data**.

### 🔧 Syntax

```js
Vendor.find().populate('firm')
```

### 📥 Full Example

```js
const vendor = await Vendor.findById(id).populate('firm');
```

This returns:

```json
{
  "userName": "Ramesh",
  "firm": [
    {
      "_id": "64ab...",
      "firmName": "Ramesh Foods"
    }
  ]
}
```

---

## 🎯 Purpose of Ref & Populate

| Feature      | Purpose                                  |
| ------------ | ---------------------------------------- |
| `ref`        | Create relationships between collections |
| `populate()` | Fetch related documents easily           |

---

## 🔥 Tricks

* Always use `populate()` when you need related data.
* Use `select` to limit fields: `.populate('firm', 'firmName')`.
* Use `lean()` for performance: `.populate('firm').lean()`.

---

## 📝 Summary

* **Multer** is used for file uploads (images, PDFs, etc.)
* **Ref** creates a relationship between MongoDB collections
* **Populate** fetches related documents automatically
* Helps build advanced structures like: users → posts, vendors → firms, authors → books

---

# ⚙️ Middleware & `next()` — Complete Guide

## ⭐ What is Middleware in Express?

Middleware is a **function that runs between the request and response cycle**.

It can:

* Validate data
* Verify JWT tokens
* Log requests
* Modify `req` or `res`
* Control access to routes

Middleware receives **three arguments**:

```js
(req, res, next)
```

---

## 🔧 Syntax of Middleware

```js
const myMiddleware = (req, res, next) => {
  console.log("Middleware ran");
  next();
};
```

Apply to route:

```js
app.get('/home', myMiddleware, (req, res) => {
  res.send('Home Page');
});
```

---

## ⭐ What is `next()`?

`next()` tells Express to:
➡️ "Move to the next middleware or route handler"

Without `next()`, the request will **hang** and no response will return.

---

## 📥 Example: Logging Middleware

```js
const logger = (req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

---

## 📥 Example: JWT Authentication Middleware

```js
const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.vendorId = decoded.vendorId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
```

Use it:

```js
app.get('/vendor/dashboard', verifyToken, (req, res) => {
  res.json({ message: "Welcome Vendor" });
});
```

---

## 🎯 Purpose of Middleware

| Purpose        | Example                    |
| -------------- | -------------------------- |
| Authentication | JWT token verification     |
| Authorization  | Check roles (admin/vendor) |
| Logging        | Track incoming requests    |
| Validations    | Check request body fields  |
| Error handling | Catch and manage errors    |

---

## 🔥 Tricks

* Use `app.use()` to apply middleware globally.
* Use multiple middleware in one route:

```js
app.get('/test', auth, checkRole, validate, handler);
```

* Always call `next()` unless sending a response.
* Use **error-handling middleware** for cleaner code.

---

## 📝 Summary

* Middleware runs **before** the final route handler.
* `next()` moves to the next function in the request pipeline.
* Used for JWT, validations, roles, logging, file uploads, etc.
* Makes your Express code cleaner and modular.

---

# 📌 `getAllVendor` & `getVendorById` — Explanation

## 🔍 **getAllVendor** — Fetch All Vendors

This controller retrieves **all vendors** from the database.
It also uses **populate()** to replace the `firm` ObjectId with full firm details.

### ✔️ Code

```js
const vendor = await Vendor.find().populate('firm');
```

### ✔️ Explanation

* `Vendor.find()` → fetches all vendor documents.
* `.populate('firm')` → fetches full firm documents linked to vendors.
* Returns a JSON response containing all vendors + their firms.

### 📤 Example Output

```json
{
  "vendor": [
    {
      "userName": "Ramesh",
      "email": "ramesh@gmail.com",
      "firm": [
        { "_id": "64ab12", "firmName": "Ramesh Foods" }
      ]
    }
  ]
}
```

---

## 🔍 **getVendorById** — Fetch a Single Vendor

This controller fetches **one vendor** using `req.params.id`.

### ✔️ Code

```js
const vendor = await Vendor.findById(vendorId).populate('firm');
```

### ✔️ Explanation

* `findById(vendorId)` → finds vendor by its `_id`.
* `.populate('firm')` → loads full firm details.
* If vendor doesn't exist → returns 404 error.

### 📤 Example Output

```json
{
  "vendor": {
    "userName": "Ramesh",
    "firm": [
      { "_id": "64ab45", "firmName": "Ramesh Hotel" }
    ]
  }
}
```

---

# 🔗 Mongoose `populate()` — Complete Guide

## ⭐ What is `populate()`?

`populate()` is a Mongoose function that **automatically replaces ObjectId references with actual document data**.

It works only when you use `ref` in your schema.

---

## 🔧 Syntax

```js
Model.find().populate('fieldName')
```

Example:

```js
Vendor.find().populate('firm')
```

---

## 📥 Example

### Vendor Schema

```js
firm: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Firm'
}]
```

### Query

```js
const vendor = await Vendor.find().populate('firm');
```

### Output

```json
{
  "firm": [
    {
      "_id": "64ab",
      "firmName": "Ramesh Foods"
    }
  ]
}
```

---

## 🎯 Purpose of `populate()`

| Purpose                | Description                           |
| ---------------------- | ------------------------------------- |
| Join-like behavior     | Works like SQL JOIN for MongoDB       |
| Fetch related docs     | Replaces ObjectId with full document  |
| Clean API response     | More readable JSON response           |
| Avoid multiple queries | Retrieves related data in one request |

---

## 🔥 Tricks

* Limit fields:

```js
.populate('firm', 'firmName')
```

* Populate multiple fields:

```js
.populate('firm products')
```

* Deep populate:

```js
.populate({ path: 'firm', populate: { path: 'owner' } })
```

* Use `lean()` for faster response:

```js
Vendor.find().populate('firm').lean();
```

---

## 📝 Summary

* `populate()` replaces ObjectId with meaningful data.
* Useful for relations like **Vendor → Firm**, **User → Posts**, **Order → Product**.
* Reduces number of database queries.
* Makes API responses more powerful and readable.

---
