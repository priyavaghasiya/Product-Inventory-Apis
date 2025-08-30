import express from "express";
import mongoose from "mongoose";
import productRoute from "./routes/product.route.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", false);

const PORT = 8000;
const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.use("/api", productRoute);

console.log(process.env.DB_URL);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
  })
  .catch((error) => console.log(error.message));

export default app;
