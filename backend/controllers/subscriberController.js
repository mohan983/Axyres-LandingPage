import Subscriber from "../models/subscriberModel.js"

export const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }
    
    const newSubscriber = new Subscriber({
      email
    })
    await newSubscriber.save()
    return res.json({ success: true, message: "Subscribed Successfully" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Subscription Failed" })
  }
}
