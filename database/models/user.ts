import { Document, model, models, Schema } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

const SALT_WORK_FACTOR = 10;

export interface UserInterface extends Document {
  username: string;
  password: string;
  email: string;
  setPassword: (pswd: string) => void;
  validatePassword: (pswd: string) => Promise<boolean>;
}

const User: Schema<UserInterface> = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

User.pre("save", function (next) {
  let user: UserInterface = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

User.methods.validatePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return compare(candidatePassword, this.password);
};

export default models.User || model("User", User);
