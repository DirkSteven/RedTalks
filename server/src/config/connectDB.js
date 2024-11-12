import mongoose from 'mongoose';

export async function connectDB() {
  console.log('connectDB function started');
  const uri = process.env.MONGODB_KEY;
  
  // console.log('MongoDB URI:', uri);

  if (!uri) {
    console.error("MongoDB URI is missing in environment variables.");
    process.exit(1); // Exit the process with failure status
  }

  // mongoose.set('debug', true);  // Enable Mongoose debug mode for better error tracking
  
  try {
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,  // Timeout for socket
      connectTimeoutMS: 30000, // Timeout for initial connection
      ssl: true,  
    });

    // mongoose.connection.on('connected', () => {
    //   console.log('Connected to MongoDB');
    // });

    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit 
  }
}


