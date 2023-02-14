import { compare, genSalt, hash } from "bcrypt";
import {
  Document,
  Model,
  model,
  models,
  ObjectId,
  RefType,
  Schema,
} from "mongoose";
import { SALT_WORK_FACTOR } from "../../constants";

export interface PhewInterface extends Document {
  user: ObjectId;
  password: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
  isPublic: boolean;
}

const phew: Schema<PhewInterface> = new Schema<PhewInterface>({
  user: {
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
  isPublic: {
    type: Boolean,
    default: false,
  },
});

phew.pre("save", function (next) {
  let phew: PhewInterface = this;

  // only hash the password if (it has been modified or is new) and (not empty)
  if (!phew.password || !phew.isModified("password")) {
    return next();
  }

  genSalt(SALT_WORK_FACTOR, (err: Error | undefined, salt: string): void => {
    if (err) return next(err);
    hash(phew.password, salt, (err: Error | undefined, hash: string): void => {
      if (err) return next(err);
      // overwrite the password with the hashed one
      phew.password = hash;
      next();
    });
  });
});

phew.methods.validatePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return compare(candidatePassword, this.password);
};

const Phew: Model<any, {}, {}, {}, any> = models.Phew || model("phew", phew);

export default Phew;
