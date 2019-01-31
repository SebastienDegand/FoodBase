const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:password06@ds111455.mlab.com:11455/foodbasedb";
let db = null;

app.use(express.static(__dirname + "/public"));

app.get("/api/v1/foods", async function(req, res) {
  try {
    let page =
      req.param("page") === undefined ||
      req.param("page") === "" ||
      req.param("page") <= 0
        ? 1
        : req.param("page");
    let per_page =
      req.param("per_page") === undefined ||
      req.param("per_page") === "" ||
      req.param("per_page") <= 0
        ? 30
        : req.param("per_page");
    let pagination = {};

    pagination.skip = per_page * (page - 1);
    pagination.limit = parseInt(per_page);

    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    let foods = await findFoods(db, pagination);
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

async function findFoods(db, pagination) {
  const collection = await db.collection("france");
  const foods = await collection
    .find({})
    .limit(pagination.limit)
    .skip(pagination.skip)
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
