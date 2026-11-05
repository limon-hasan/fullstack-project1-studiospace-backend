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
const bookingsCollection = db.collection("bookings");

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

app.get("/my-studios", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res
        .status(400)
        .send({ message: "Email query parameter is required" });
    }
    const result = await studiosCollection
      .find({ ownerEmail: email })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching my studios:", error);
    res.status(500).send({ message: "Failed to fetch user studios" });
  }
});

app.delete("/studios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await studiosCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Studio not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("Error deleting studio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/edit-studios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await studiosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData } },
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Studio not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("Error updating studio:", error);
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

// Starting booking API data -->
app.post("/add-my-bookings", async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = {
      ...bookingData,
      status: "Pending",
      createdAt: new Date(),
    };
    const result = await bookingsCollection.insertOne(bookingData);
    console.log(result);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error adding single bookings data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/show-bookings", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .send({ message: "Email query parameter is required" });
    }
    const result = await bookingsCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching my booking:", error);
    res.status(500).send({ message: "Failed to fetch user bookings" });
  }
});

// PATCH /my-bookings/:id/cancel
app.patch("/my-bookings/:id/cancel", async (req, res) => {
  try {
    const id = req.params.id;
    const updateDoc = {
      $set: {
        status: "Cancelled",
        updatedAt: new Date(),
      },
    };

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc,
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated to Cancelled",
    });
  } catch (error) {
    console.error("Cancellation error:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at Limons Backend port ${port}`);
});

export default app;
