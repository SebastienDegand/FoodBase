const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:password06@ds111455.mlab.com:11455/foodbasedb";
let db = null;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/v1/foods", async function(req, res) {
  try {
    let pagination = getPagination(req);

    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    let foods = await findFoods(db, pagination, req.query.lastid);
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

app.post("/api/v1/recipes", async function(req, res) {
  try {
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    const result = await addRecipe(
      db,
      req.body.name,
      req.body.author,
      req.body.ingredients
    );
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/recipes", async function(req, res) {
  try {
    let pagination = getPagination(req);
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    const result = await getRecipes(db, pagination, req.query.lastid);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("listening on " + port);
});

async function findFoods(db, pagination, lastid) {
  const collection = await db.collection("france");
  let result = await findDocuments(collection, pagination, lastid);
  console.log("foods found");
  return result;
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

async function addRecipe(db, name, author, ingredients) {
  const collection = await db.collection("recipe");
  const result = await collection.insert({
    name: name,
    author: author,
    ingredients: ingredients
  });
  console.log("recipes added");
  return result.ops[0];
}

async function getRecipes(db, pagination, lastid) {
  const collection = await db.collection("recipe");
  let result = await findDocuments(collection, pagination, lastid);
  console.log("recipes found");
  return result;
}

async function findDocuments(collection, pagination, lastid) {
  let result;
  if (lastid) {
    result = await collection
      .find({ id: { $gt: lastid } })
      .limit(pagination.limit)
      .toArray();
  } else {
    result = await collection
      .find({})
      .limit(pagination.limit)
      .skip(pagination.skip)
      .toArray();
  }
  return result;
}

function getPagination(req) {
  let page =
    req.query.page === undefined || req.query.page === "" || req.query.page <= 0
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
  return pagination;
}
