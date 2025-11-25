const express = require("express");
const { vendorRegister, vendorLogin } = require("../controllers/vendorController");

const router = express.Router();

router.post("/register", vendorRegister);
router.post("/login", vendorLogin);

module.exports = router;