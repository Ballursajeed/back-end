import mongoose from "mongoose"

const subscriptionSchema = new Schema({
  subscriber:{
        type: Schema.Types.ObjectID, //one who is subscribing
        ref: "User"
  },
  channel:{
         type: Schema.Types.ObjectID, //one who "subscriber" is subscribing
         ref: "User" wse
  }
},{ timestamps: true })

export const Subscription = mongoose.model("Subscription",subscriptionSchema)