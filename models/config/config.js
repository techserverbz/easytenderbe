const { default: mongoose } = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
require("dotenv").config();
var uri = process.env.URI

// ////console.log(config)
mongoose.connect(uri).then(() => {
    
    console.log("database connection is established")
}).catch((err) => {
    ////console.log("error while connecting in database" , err)
})