const mongoose = require('mongoose');
require("dotenv").config();

let cached = global._mongooseConnection;

if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

const uri = process.env.URI;

if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
    }).then((m) => {
        console.log("database connection is established");
        cached.conn = m;
        return m;
    }).catch((err) => {
        cached.promise = null;
        console.log("error while connecting to database", err);
    });
}