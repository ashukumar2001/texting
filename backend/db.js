import mongoose from "mongoose";
import { DATABASE_URL } from "./config/index.js";

const DbConnect = () => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", () => {
    console.log("Database connected sucessfully!");
  });
};

export default DbConnect;
