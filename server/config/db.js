import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(
          `MongoDB connected Successfully on ${conn.connection.name}`
        );
        
    } catch (error) {
        console.log(`MongoDb is connection failed ${error}`);
        process.exit(1);
    }
}

export default connectDB