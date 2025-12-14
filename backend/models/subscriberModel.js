import mongoose from "mongoose"

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true }
})

export default mongoose.model('Subscriber', subscriberSchema)
