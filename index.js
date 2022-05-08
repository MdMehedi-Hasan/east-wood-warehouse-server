const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection starts here (version: 4.0 or later)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_ACCESS}@cluster0.avcst.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
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
    // Here we are finding a single product with id (This api is collaborating with homepage inventory section)
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });
    // In below code we are trying to add a new product to the server
    app.post("/product", async (req, res) => {
      const singleProduct = req.body;
      const result = await productsCollection.insertOne(singleProduct);
      res.send(result);
    });
    // In below code we are trying to delete an existing product from the server
    app.delete("/products/:id", async (req, res) => {
      const id = req.params;
      const query ={ _id: ObjectId(id) } ;
      // console.log(id,query);
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    // deliver stock (updating quantity)
    app.put("/products/:id", async(req, res) => {
      const id = req.params;
      const filter = { _id: ObjectId(id) };
      const productQnt = req.body.quantity;
      const newQnt = productQnt - 1;
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          quantity: newQnt
        },
      };
      const updatedQnt = await productsCollection.updateOne(filter, updateProduct, options);
      console.log(req.body.quantity);
      res.send(updatedQnt);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
// MongoDB connection ends
app.get("/", (req, res) => {
  res.send('Running Eastwood API')
})
app.listen(port, () => {
  console.log(`Assignment 11 app listening on port ${port}`);
});
