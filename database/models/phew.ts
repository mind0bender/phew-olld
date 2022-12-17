import { Document, RefType, Schema } from "mongoose";

export interface PhewInterface extends Document {
  username: RefType;
  password: string | null;
  content: string;
  updatedAt: Date;
  createdAt: Date;
  shared: RefType[];
}

const Phew: Schema<PhewInterface> = new Schema<PhewInterface>({
  username: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  password: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
  updatedAt: {
    type: Date,
    default: (): number => Date.now(),
  },
  createdAt: {
    type: Date,
    default: (): number => Date.now(),
  },
  shared: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
