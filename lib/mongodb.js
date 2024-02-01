import mongoose, { mongo } from "mongoose"

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("error connecting to MongoDB: ", error);
    }
}
