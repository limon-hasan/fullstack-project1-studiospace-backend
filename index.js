import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB();
const db = mongoClient.db("studiospace");
const studiosCollection = db.collection("studios");

app.get("/", (req, res) => {
  res.send({ message: "Server is running fine Limon!!!" });
});

app.get("/studios", async (req, res) => {
  try {
    const data = await studiosCollection.find().toArray();
    res.send(data);
  } catch (error) {
    console.error("Error fetching all studios:", error);
    res.status(500).json({ message: "Failed to fetch all studios" });
  }
});

app.get("/studios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await studiosCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    console.error("Error fetching single studio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/add-studio", async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    const result = await studiosCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error adding single studio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/featured-studios", async (req, res) => {
  try {
    const result = await studiosCollection
      .find()
      .sort({ rating: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching featured studios:", error);
    res.status(500).json({ message: "Failed to fetch featured studios" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at Limons Backend port ${port}`);
});

export default app;
