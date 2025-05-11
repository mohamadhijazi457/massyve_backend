import mongoose from 'mongoose';

// to make sure TS knows about the environment variable type
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      NODE_ENV: 'development' | 'production';
      PORT: string;
      JWT_SECRET: string;
    }
  }
}

const connectDB = async (): Promise<void> => {
  try {
    const dbURI = process.env.MONGO_URI;

    if (!dbURI) {
      throw new Error('MongoDB URI is missing in the environment variables.');
    }

    await mongoose.connect(dbURI);
    console.log(`MongoDB connected to ${process.env.NODE_ENV} database`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('MongoDB connection failed:', error.message);
    }
    process.exit(1); // in case the DB connection fails
  }
};

export default connectDB;
