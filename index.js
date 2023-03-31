const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kusbv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const courseCollection = client.db("task").collection("courses");
  const categoryCollection = client.db("task").collection("category");
  try {
    //insert course into the database
    app.post("/add", async (req, res) => {
      const info = req.body;
      const result = await courseCollection.insertOne(info);

      const findCategory = await categoryCollection.findOne({
        category: info.category,
      });
      if (!findCategory) {
        const insert = await categoryCollection.insertOne({
          category: info.category,
        });
      }
      res.send(result);
    });

    //find all courses
    app.get("/allCourses", async (req, res) => {
      const cursor = courseCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //find all categories
    app.get("/allCategories", async (req, res) => {
      const result = await categoryCollection.find({}).toArray();
      res.send(result);
    });
  } catch {}
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("api found");
});
app.listen(port, () => {
  console.log("server running");
});
