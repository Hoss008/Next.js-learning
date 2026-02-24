import mongoose, { Document, Schema, Model, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    // Reference to Event document
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Index for faster lookups by event
    },

    // Email with built-in format validation
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    },
  },
  { timestamps: true },
);

// Pre-save hook: verify the referenced Event exists before saving a booking
BookingSchema.pre<IBooking>("save", async function (next) {
  if (this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      return next(new Error(`Event with ID "${this.eventId}" does not exist`));
    }
  }

  next();
});

// Reuse compiled model if it already exists (prevents OverwriteModelError in dev)
const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
