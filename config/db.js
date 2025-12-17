//import and cinfigure dotenv
require('dotenv').config()
// 1 import mongoose 
const mongoose = require('mongoose')
const dbString = process.env.connectionString

if (!dbString) {
    console.error('\nERROR: MongoDB connection string not found.\nPlease create a `.env` file in `bookstore-backend/` with a line like:\n\n  connectionString="your-mongodb-connection-string"\n  jwtKey="some_secret_key"\n\nYou can use a local MongoDB URI (e.g. mongodb://localhost:27017/bookstore) or a MongoDB Atlas URI.\n')
    // Exit process so developer notices and supplies credentials
    process.exit(1)
}

//2 connect to mongodb database 
mongoose.connect(dbString).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error connecting to MongoDB',err);
    
})