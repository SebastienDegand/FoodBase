const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const utils = require("./utils");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:password06@ds111455.mlab.com:11455/foodbasedb";
const dbName = "foodbasedb";
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
    console.log("get foods");
    let config = {};
    config.pagination = getPagination(req);
    config.sorting = getSorting(req);
    config.product_name =
      req.query.name === undefined || req.query.name === ""
        ? ""
        : req.query.name;
    config.allergen =
      req.query.allergen === undefined || req.query.allergen === ""
        ? [""]
        : req.query.allergen === "none"
        ? ["none"]
        : req.query.allergen.split(" ").map(val => {
            return "en:" + val;
          });
    config.additive =
      req.query.additive === undefined || req.query.additive === ""
        ? [""]
        : req.query.additive === "none"
        ? ["none"]
        : req.query.additive.split(" ").map(val => {
            return "en:" + val;
          });
    config.shop =
      req.query.shop === undefined || req.query.shop === ""
        ? undefined
        : req.query.shop.split(" ");

    let foods = await utils.findFoods(db, config);
    res.send(foods);
    console.log("foods found");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/v1/foods/:id", async function(req, res) {
  try {
    console.log("get food by id");
    let food = await utils.findFoodById(db, req.params.id);
    res.send(food);
    console.log("food " + req.params.id + " found");
  } catch (error) {
    console.error(error);
  }
});

app.put("/api/v1/foods/:id", async function(req, res) {
  try {
    console.log("update pricing");
    let price = req.body.price;
    let store = req.body.store ? req.body.store : "";
    let entryDate = +new Date();
    let pricing = {};
    pricing.price = price;
    pricing.store = store.replace(/ /g, "-");
    pricing.entryDate = entryDate;
    let food = await utils.updateFood(db, req.params.id, pricing);
    res.send(food);
    console.log("food " + req.params.id + " updated");
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/v1/recipes", async function(req, res) {
  try {
    console.log("create recipe");
    const result = await utils.addRecipe(
      db,
      req.body.name,
      req.body.author,
      req.body.ingredients,
      req.body.image_link
    );
    res.send(result);
    console.log("recipe added");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/v1/recipes", async function(req, res) {
  try {
    console.log("get recipes");
    let pagination = getPagination(req);
    const result = await utils.getRecipes(db, pagination);
    res.send(result);
    console.log("recipes found");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/v1/recipes/:id", async function(req, res) {
  try {
    console.log("get recipe by id");
    let result = await utils.findRecipeById(db, req.params.id);
    res.send(result);
    console.log("recipe " + req.params.id + " found");
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/v1/recipes/:id/comments", async function(req, res) {
  try {
    console.log("create comment");
    const result = await utils.addComment(
      db,
      req.body.note,
      req.body.author,
      req.body.comment,
      req.params.id
    );
    res.send(result);
    console.log("comment added");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/v1/recipes/:id/comments", async function(req, res) {
  try {
    console.log("get comments");
    let pagination = getPagination(req);
    const result = await utils.getComments(db, pagination, req.params.id);
    res.send(result);
    console.log("comments found");
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  try {
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    db = await client.db(dbName);
    app.listen(port, () => {
      console.log("listening on " + port);
    });
  } catch (err) {
    console.error(err);
  }
})();

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
