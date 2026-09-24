import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    settings: {
      businessHours: {
        start: { type: String, default: '09:00' }, // HH:mm format
        end: { type: String, default: '18:00' },   // HH:mm format
        timezone: { type: String, default: 'UTC' },
      },
      workDays: {
        type: [Number],
        default: [1, 2, 3, 4, 5], // Mon=1 to Fri=5
      },
      allowSelfRegistration: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', organizationSchema);
