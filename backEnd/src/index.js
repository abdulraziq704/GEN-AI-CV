import express from "express";
import "dotenv/config"; // MUST be the first import
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookie from "cookie-parser";
import cors from "cors"; 
import { clerkMiddleware } from "@clerk/express";
import Airouter from "./Routes/aiResponse.route.js";
import cvRouter from "./Routes/cv.route.js";

const app = express();
process.on("uncaughtException", (err) => {
  console.error("🔴🔴 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔴🔴 UNHANDLED REJECTION:", reason);
});
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(cookie());
app.use("/ai", Airouter);
app.use("/cv", cvRouter);

connectDB();
console.log("KEY LOADED:", !!process.env.GEMINI_API_KEY);
console.log("CLERK SECRET LOADED:", !!process.env.CLERK_SECRET_KEY); // 👈 ye add karo
// AIresponse();

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.use((err, req, res, next) => {
  console.error("🔴 ERROR MIDDLEWARE CAUGHT:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
