import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    NotificationTime: {
      type: Date,
      default: Date.now(),
      // required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: false,
    },
    deviceTokens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeviceToken",
         default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
