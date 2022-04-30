const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// MongoDB connection starts here (version: 4.0 or later)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_ACCESS}@cluster0.avcst.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// const collection = client.db("test").collection("devices");

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("Eastwood").collection("products");
    // This is the collection of all products. All the data from database is gathering in this route.
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray(query);
      res.send(products);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
// MongoDB connection ends

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
