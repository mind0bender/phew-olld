import mongoose from "mongoose";
const { MONGODB_USER, MONGODB_PSWD } = process.env;
if (!(MONGODB_USER && MONGODB_PSWD)) {
  throw new Error(
    "Please define the MONGODB_USER & MONGODB_PSWD environment variable inside .env.local"
  );
}
const MONGODB_URI: string = `mongodb+srv://${MONGODB_USER}:${MONGODB_PSWD}@mycluster.sxsst.mongodb.net/?retryWrites=true&w=majority`;

let cached: {
  conn?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = (global.mongoose = { conn: undefined, promise: undefined });

const dbConnect: () => Promise<typeof mongoose> = (): Promise<
  typeof mongoose
> => {
  return new Promise(
    (
      resolve: (value: typeof mongoose) => void,
      reject: (reason?: any) => void
    ): void => {
      if (cached.conn) {
        resolve(cached.conn);
      }

      if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
        cached.promise
          .then((conn: typeof mongoose): void => {
            console.log("	connected to database");
            cached.conn = conn;
            resolve(conn);
          })
          .catch(reject);
      }
    }
  );
};

export default dbConnect;
