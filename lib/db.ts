import mongoose from "mongoose"

const connectMongoDB = async () => {

  console.log({ connections: mongoose.connections });

  // check for an existing connection, reuse it
  if (mongoose.connections[0].readyState) {    
    return true;
  }

  try {
    const URI = process.env.MONGODB_URI;

    if (!URI) {
      throw new Error("Please set a MongoDB URI");
    }
    
    await mongoose.connect(URI);
    console.log('MongoDB connected');

    return true;
  } catch (error) {
    throw new Error("Could not connect to MongoDB");
  }
}

export default connectMongoDB;