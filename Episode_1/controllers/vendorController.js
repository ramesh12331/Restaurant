const Vendor = require("../models/Vendor");
const bcrypt = require("bcrypt");


const vendorRegister = async(req,res) =>{ 
    const {userName, email, password} = req.body;
    try {
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({userName, email, password:hashedPassword});

        await newVendor.save();
        res.status(201).json({message: "Vendor registered successfully"});
        console.log('registered')
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
}

const vendorLogin = async(req,res) =>{
    const {email,password} = req.body;
    try {
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error: "Invalid username or password"})
        }
        res.status(200).json({success:"Login successful"});
        console.log(email)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
}

module.exports = {vendorRegister, vendorLogin}