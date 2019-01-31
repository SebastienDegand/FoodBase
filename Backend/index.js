const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:password06@ds111455.mlab.com:11455/foodbasedb";
let db = null;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/api/v1/foods", async function(req, res) {
  try {
    let page =
      req.query.page === undefined ||
      req.query.page === "" ||
      req.query.page <= 0
        ? 1
        : req.query.page;
    let per_page =
      req.query.per_page === undefined ||
      req.query.per_page === "" ||
      req.query.per_page <= 0
        ? 30
        : req.query.per_page;
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

app.put("/api/v1/foods/:id", async function(req, res) {
  try {
    let price = req.body.price;
    let store = req.body.store;
    let entryDate = +new Date();
    let pricing = {};
    pricing.price = price;
    pricing.store = store;
    pricing.entryDate = entryDate;
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    let food = await updateFood(db, req.params.id, pricing);
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
  console.log("food " + id + " found");
  return food;
}

async function updateFood(db, id, pricing) {
  const collection = await db.collection("france");
  await collection.updateOne(
    { _id: id },
    {
      $set: {
        pricing: {
          price: pricing.price,
          store: pricing.store,
          entryDate_t: pricing.entryDate
        }
      }
    }
  );
  const food = await collection.findOne({ _id: id });
  console.log("food " + id + " updated");
  return food;
}
