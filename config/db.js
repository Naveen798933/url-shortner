const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI;
    
    if (!dbUri) {
      console.error('Error: MONGO_URI is missing in .env file');
      process.exit(1);
    }

    await mongoose.connect(dbUri);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
