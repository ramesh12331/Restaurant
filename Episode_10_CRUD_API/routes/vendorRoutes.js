const express = require("express");
const { vendorRegister, vendorLogin, getAllVendor, getVendorById } = require("../controllers/vendorController");

const router = express.Router();

router.post("/register", vendorRegister);
router.post("/login", vendorLogin);
router.get("/all-vendors", getAllVendor)
router.get("/single-vendor/:id", getVendorById)
module.exports = router;