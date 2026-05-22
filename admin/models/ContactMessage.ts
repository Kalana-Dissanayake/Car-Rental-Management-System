import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
  fullName: string;
  email: string;
  phone: string;
  vehicleType: string;
  pickupDate: string;
  returnDate: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: {
        values: ['economy', 'compact', 'midsize', 'suv', 'luxury', 'van', 'truck', 'sports'],
        message: 'Invalid vehicle type selected',
      },
    },
    pickupDate: {
      type: String,
      required: [true, 'Pickup date is required'],
    },
    returnDate: {
      type: String,
      required: [true, 'Return date is required'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message must not exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new',
    },
  },
  {
    timestamps: true,
    strict: true, // Reject extra fields not in schema
  }
);

// Index for efficient sorting
ContactMessageSchema.index({ createdAt: -1 });

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
