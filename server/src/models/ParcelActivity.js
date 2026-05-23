import mongoose from 'mongoose';

const parcelActivitySchema = new mongoose.Schema(
  {
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fromLocation: {
      type: String,
      required: [true, 'From location is required'],
      trim: true
    },
    toLocation: {
      type: String,
      required: [true, 'To location is required'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

parcelActivitySchema.index({ helper: 1, isActive: 1 });

const ParcelActivity = mongoose.model('ParcelActivity', parcelActivitySchema);

export default ParcelActivity;

