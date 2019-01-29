const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:password06@ds111455.mlab.com:11455/foodbasedb";
let db = null;

app.use(express.static(__dirname + "/public"));

app.get("/api/v1/foods", async function(req, res) {
  try {
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    let foods = await findFoods(db);
    res.send(foods);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/foods/:id", async function(req, res) {
  try {
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    let food = await findFoodsById(db, req.params.id);
    res.send(food);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("listening on " + port);
});

async function findFoods(db) {
  const collection = await db.collection("france");
  const foods = await collection
    .find({})
    .limit(30)
    .toArray();
  console.log("foods found");
  return foods;
}

async function findFoodsById(db, id) {
  const collection = await db.collection("france");
  const food = await collection.findOne({ _id: id });
  console.log("foods " + id + " found");
  return food;
}
