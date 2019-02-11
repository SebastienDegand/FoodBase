const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

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
    let config = {};
    config.pagination = getPagination(req);
    config.sorting = getSorting(req);
    config.product_name =
      req.query.name === undefined || req.query.name === ""
        ? ""
        : req.query.name;
    config.lastid = req.query.lastid;
    config.allergen =
      req.query.allergen === undefined || req.query.name === ""
        ? ""
        : req.query.allergen.split("+").map(val => {
            return "en:" + val;
          });
    config.additive = req.query.additive;

    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");

    let foods = await findFoods(db, config);
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
    let food = await findFoodById(db, req.params.id);
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
    pricing.store = store.replace(/ /g, "-");
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

app.get("/api/v1/recipes/:id", async function(req, res) {
  try {
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    let result = await findRecipeById(db, req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/recipes/:id/comments", async function(req, res) {
  try {
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    const result = await addComment(
      db,
      req.body.note,
      req.body.author,
      req.body.comment,
      req.params.id
    );
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/recipes/:id/comments", async function(req, res) {
  try {
    let pagination = getPagination(req);
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    const db = await client.db("foodbasedb");
    const result = await getComments(
      db,
      pagination,
      req.query.lastid,
      req.params.id
    );
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("listening on " + port);
});

async function findFoods(db, config) {
  const collection = await db.collection("france");
  let result;
  if (config.lastid) {
    result = await collection
      .find({
        _id: { $gt: config.lastid },
        product_name: { $ne: null },
        product_name: new RegExp(config.product_name)
      })
      .sort({ [config.sorting.sorted_by]: config.sorting.order })
      .limit(config.pagination.limit)
      .toArray();
  } else {
    result = await collection
      .find({
        $and: [
          { product_name: { $ne: null } },
          { product_name: new RegExp(config.product_name) },
          { allergens_tags: { $nin: config.allergen } }
        ]
      })
      .sort({ [config.sorting.sorted_by]: config.sorting.order })
      .limit(config.pagination.limit)
      .skip(config.pagination.skip)
      .toArray();
  }
  console.log("foods found");
  return result;
}

async function findFoodById(db, id) {
  const collection = await db.collection("france");
  const food = await collection.findOne({ _id: id });
  console.log("food " + id + " found");
  return food;
}

async function findRecipeById(db, id) {
  const collection = await db.collection("recipe");
  const result = await collection.findOne({ _id: ObjectId(id) });
  console.log("recipe " + id + " found");
  return result;
}

async function updateFood(db, id, pricing) {
  const collection = await db.collection("france");
  await collection.updateOne(
    { _id: id },
    {
      $set: {
        pricing: {
          price: pricing.price,
          entryDate_t: pricing.entryDate
        }
      },
      $push: { stores_tags: pricing.store }
    }
  );
  const food = await collection.findOne({ _id: id });
  console.log("food " + id + " updated");
  return food;
}

async function addRecipe(db, name, author, ingredients) {
  const collection = await db.collection("recipe");
  const result = await collection.insertOne({
    name: name,
    author: author,
    ingredients: ingredients,
    createTime: new Date().toISOString()
  });
  console.log("recipe added");
  return result.ops[0];
}

async function getRecipes(db, pagination, lastid) {
  const collection = await db.collection("recipe");
  let result;
  if (lastid) {
    result = await collection
      .find({ _id: { $gt: lastid } })
      .limit(pagination.limit)
      .toArray();
  } else {
    result = await collection
      .find({})
      .limit(pagination.limit)
      .skip(pagination.skip)
      .toArray();
  }
  console.log("recipes found");
  return result;
}

async function addComment(db, note, author, comment, recipeId) {
  const collection = await db.collection("comment");
  const result = await collection.insertOne({
    note: parseInt(note),
    author: author,
    comment: comment,
    recipeId: ObjectId(recipeId),
    createTime: new Date().toISOString()
  });
  console.log("comment added");
  return result.ops[0];
}

async function getComments(db, pagination, lastid, recipeId) {
  const collection = await db.collection("comment");
  let result;
  if (lastid) {
    result = await collection
      .find({ recipeId: ObjectId(recipeId), _id: { $gt: lastid } })
      .limit(pagination.limit)
      .toArray();
  } else {
    result = await collection
      .find({ recipeId: ObjectId(recipeId) })
      .limit(pagination.limit)
      .skip(pagination.skip)
      .toArray();
  }
  console.log("comments found");
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

function getSorting(req) {
  let sorting = {};
  sorting.sorted_by =
    req.query.sorted_by === undefined || req.query.sorted_by === ""
      ? "_id"
      : req.query.sorted_by;
  sorting.order =
    req.query.order === undefined ||
    req.query.order === "" ||
    req.query.order === "increasing"
      ? 1
      : -1;
  return sorting;
}
