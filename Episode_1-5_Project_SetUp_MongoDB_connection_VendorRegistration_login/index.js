const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require("body-parser");
const app = express();
dotEnv.config()

const PORT = 4000;

app.use(bodyParser.json());
app.use("/vendor", vendorRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connect successfully!!!")
})
.catch((err)=>{
    console.log(err.mesage)
})
app.listen(PORT, ()=>{
    console.log(`server connecting on ${PORT}`)
})