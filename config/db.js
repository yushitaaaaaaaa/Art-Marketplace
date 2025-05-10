const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!connectionString) {
      console.error("ERROR: MongoDB connection string not found in environment variables.");
      console.error("Please check your .env file and ensure MONGO_URI or MONGODB_URI is defined.");
      process.exit(1);
    }
    
    console.log("Attempting to connect to MongoDB...");
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name).join(', ');
    
    console.log(`MongoDB connected successfully to: ${mongoose.connection.host}`);
    console.log(`Available collections: ${collectionNames || 'none'}`);
    
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.error("Connection string used: " + (process.env.MONGO_URI || process.env.MONGODB_URI || "undefined"));
    process.exit(1);
  }
};

module.exports = connectDB;