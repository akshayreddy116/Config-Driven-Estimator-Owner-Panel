import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import configRoutes from "./routes/config.routes.js";
import estimateRoutes from "./routes/estimate.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_ORIGIN,
      "https://config-driven-estimator-owner-panel-nine.vercel.app"
    ],
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/config", configRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });