import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true }
});

const Url = mongoose.model("Url", urlSchema);

app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "URL is required" });
  try {
    const hash = crypto.createHash("md5").update(longUrl).digest("hex");
    const shortCode = hash.slice(0, 6);
    let entry = await Url.findOne({ shortCode });
    if (!entry) {
      entry = new Url({ longUrl, shortCode });
      await entry.save();
    }
    res.json({ shortCode });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:shortCode", async (req, res) => {
  try {
    const entry = await Url.findOne({ shortCode: req.params.shortCode });
    if (entry) return res.redirect(entry.longUrl);
    res.status(404).send("Short URL not found");
  } catch {
    res.status(500).send("Server error");
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
