import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB Connected")
  } catch (err) {
    console.error("DB Connection Error:", err)
    process.exit(1)
  }
}
