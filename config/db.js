const mongoose = require('mongoose');
const config = require('config');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let dbUri = config.get('mongoURI');
    
    if (!dbUri) {
      const mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
      console.log('No mongoURI provided in config. Starting in-memory MongoDB server...');
    }

    await mongoose.connect(dbUri);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
