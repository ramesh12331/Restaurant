# 📘 Vendor Authentication API (Node.js + Express + MongoDB)

A simple **Vendor Authentication System** built using **Node.js, Express, MongoDB, Mongoose, and Bcrypt**.

It includes:

- ✅ Vendor Registration  
- ✅ Vendor Login  
- ✅ Password Encryption  
- ✅ Clean MVC structure  

---

## 🚀 Features

- Register a new vendor with unique email
- Secure password hashing using **bcrypt**
- Login with email & password
- Centralized controller logic (MVC pattern)
- Environment-based configuration using **dotenv**

---

## 🏗 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Security:** Bcrypt (password hashing)
- **Config:** dotenv
- **Dev Tool:** Nodemon

---

## 📦 Dependencies – Definition & Purpose

### 1️⃣ express

- **Definition:** Fast and minimal web framework for Node.js.
- **Purpose:**  
  - Create servers  
  - Handle routes (GET, POST, PUT, DELETE)  
  - Manage middleware  

**Install:**

```bash
npm i express
```

**Example:**

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server Running");
});
```

---

### 2️⃣ nodemon

- **Definition:** A development tool that auto-restarts the server whenever you save a file.
- **Purpose:**  
  - Faster development  
  - No need to restart server manually  

**Install (dev dependency):**

```bash
npm i nodemon -D
```

**Example `package.json` script:**

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

---

### 3️⃣ mongoose

- **Definition:** ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Purpose:**  
  - Connect Node.js to MongoDB  
  - Create schemas and models  
  - Validate data  

**Install:**

```bash
npm i mongoose
```

**Example:**

```js
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
```

---

### 4️⃣ dotenv

- **Definition:** Loads environment variables from a `.env` file into `process.env`.
- **Purpose:** Keep secrets like:
  - `MONGO_URI`
  - `JWT_SECRET`
  - API keys

**Install:**

```bash
npm i dotenv
```

**Example:**

```js
require("dotenv").config();
console.log(process.env.MONGO_URI);
```

---

### 5️⃣ body-parser

- **Definition:** Middleware to parse JSON or form data sent by the client.
- **Purpose:**  
  - Read `req.body` in POST/PUT requests  

**Install:**

```bash
npm i body-parser
```

**Example:**

```js
const bodyParser = require("body-parser");
app.use(bodyParser.json());
```

> Note: In newer versions of Express, `express.json()` can be used instead of `body-parser`.

---

### 6️⃣ bcrypt

- **Definition:** Library used for hashing (encrypting) passwords.
- **Purpose:**  
  - Protect user passwords  
  - Compare hashed passwords during login  

**Install:**

```bash
npm i bcrypt
```

**Example:**

```js
const bcrypt = require("bcrypt");

const hashed = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, hashed);
```

---

## 📂 Project Structure

```bash
vendor-auth/
│
├── controllers/
│   └── vendorController.js
├── models/
│   └── Vendor.js
├── routes/
│   └── vendorRoutes.js
├── .env
├── server.js
└── package.json
```

---

## 🧩 Core Files

### ⭐ `server.js`

```js
const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require("body-parser");

const app = express();
dotEnv.config();

const PORT = 4000;

app.use(bodyParser.json());
app.use("/vendor", vendorRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!!!"))
  .catch((err) => console.log(err.message));

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

---

### ⭐ `controllers/vendorController.js`

```js
const Vendor = require("../models/Vendor");
const bcrypt = require("bcrypt");

// REGISTER
const vendorRegister = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json("Email already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      userName,
      email,
      password: hashedPassword,
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// LOGIN
const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.status(200).json({ success: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogin };
```

---

### ⭐ `routes/vendorRoutes.js`

```js
const express = require("express");
const { vendorRegister, vendorLogin } = require("../controllers/vendorController");

const router = express.Router();

router.post("/register", vendorRegister);
router.post("/login", vendorLogin);

module.exports = router;
```

---

### ⭐ `models/Vendor.js`

```js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  password:{ type: String, required: true },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
```

---

## 📥 Installation & Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd vendor-auth

# 2. Install dependencies
npm install

# 3. Create .env file and add MONGO_URI & PORT

# 4. Run in development mode
npm run dev   # uses nodemon (if configured)

# or run normally
node server.js
```

Example `package.json` scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:4000`

### 1️⃣ Register Vendor

- **URL:** `/vendor/register`  
- **Method:** `POST`  
- **Body:**

```json
{
  "userName": "Ramesh",
  "email": "ramesh@example.com",
  "password": "strongpassword123"
}
```

- **Success Response:**

```json
{
  "message": "Vendor registered successfully"
}
```

---

### 2️⃣ Login Vendor

- **URL:** `/vendor/login`  
- **Method:** `POST`  
- **Body:**

```json
{
  "email": "ramesh@example.com",
  "password": "strongpassword123"
}
```

- **Success Response:**

```json
{
  "success": "Login successful"
}
```

---

## ⚡ Tricks & Tips

| Trick                         | Meaning                     |
|------------------------------|-----------------------------|
| Always hash passwords        | Protect user accounts       |
| Use `unique: true` for email | Prevent duplicate entries   |
| Keep logic inside controllers| Clean MVC architecture      |
| Use `.env` for secrets       | Better security             |
| Use `async/await`            | Avoid callback hell         |

---

## 📝 Summary

This project helps you understand how to:

- ✅ Build a Node.js server with Express  
- ✅ Connect to MongoDB using Mongoose  
- ✅ Create routes, controllers, and models  
- ✅ Encrypt passwords using Bcrypt  
- ✅ Implement basic vendor authentication (Register + Login)  

---

## ✨ Next Steps (Improvements)

You can extend this project by adding:

- 🔐 JWT authentication (access & refresh tokens)
- 👤 Vendor profile management
- 📧 Email verification & password reset
- 🧪 Unit and integration tests
- 🌐 Frontend using React (or any framework)

Happy Coding! 💻🚀




# DEPENDENCIS

- npm i express nodemon mongoose dotenv body-parser bcrypt

UN : mamidiramesh503_db_user
PW : ramesh503