import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    // tslint:disable-next-line:no-console
    console.log('MongoDB Connected...');
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err.message);
    process.exit(1);
  }
}

export default connectDB;
