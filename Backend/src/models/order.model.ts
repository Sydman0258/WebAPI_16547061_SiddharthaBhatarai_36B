import mongoose, { Document, model, Schema } from "mongoose";

interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;

  items: IOrderItem[];

  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "picked_up"
    | "delivered"
    | "cancelled";

  deliveryAddress: string;

  subtotal: number;
  deliveryFee: number;
  total: number;

  // Payment
  paymentId?: mongoose.Types.ObjectId;
  paymentMethod: "card" | "esewa" | "cash";
  paymentStatus: "pending" | "paid" | "failed";
  transactionId?: string;
  esewaTransactionUuid?: string;
  paidAt?: Date;

  notes?: string;
  placedAt: Date;
  estimatedDelivery?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "MenuItem",
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderModelSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    // Payment
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "esewa", "cash"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
    },
esewaTransactionUuid: {
  type: String,
  index: true,
  sparse: true,
},
    paidAt: {
      type: Date,
    },
    

    notes: {
      type: String,
    },

    placedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    estimatedDelivery: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IOrder>("Order", orderModelSchema);