import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    trip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
