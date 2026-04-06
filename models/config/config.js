const mongoose = require('mongoose');
require("dotenv").config();

let cached = global._mongooseConnection;
if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    console.log("database connection is established");
    return cached.conn;
}

module.exports = connectDB;
