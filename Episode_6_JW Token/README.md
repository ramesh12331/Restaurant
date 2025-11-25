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
