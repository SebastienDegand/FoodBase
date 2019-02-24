const assert = require("assert");
const utils = require("../src/utils");
const MongoClient = require("mongodb").MongoClient;

describe("Utils test", function() {
  this.timeout(15000);
  let db = undefined;

  before(async function() {
    const url =
      "mongodb://testdb:testdb06@ds135335.mlab.com:35335/foodbasetestdb";
    const dbName = "foodbasetestdb";
    const client = await new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    db = await client.db(dbName);
  });

  after(function() {});

  describe("get food by id", function() {
    it("get food by id", async function() {
      let id = "00";
      let food = await utils.findFoodById(db, id);
      assert.equal(food._id, id);
    });
  });

  describe("search food", function() {
    it("search with 30 item per page", async function() {
      let config = getConfig(30, 1, "_id", 1, "", [""], [""], undefined);
      let foods = await utils.findFoods(db, config);
      assert.strictEqual(30, foods.length);
    });

    it("search different page", async function() {
      let config1 = getConfig(30, 1, "_id", 1, "", [""], [""], undefined);
      let foods1 = await utils.findFoods(db, config1);
      let config2 = getConfig(30, 2, "_id", 1, "", [""], [""], undefined);
      let foods2 = await utils.findFoods(db, config2);
      assert.notStrictEqual(foods2[0]._id, foods1[0]._id);
    });

    it("search with food name", async function() {
      let config = getConfig(
        30,
        1,
        "_id",
        1,
        "lignaform",
        [""],
        [""],
        undefined
      );
      let foods = await utils.findFoods(db, config);
      assert.strictEqual(foods.length, 1);
      assert.strictEqual(foods[0].product_name, "lignaform");
    });

    it("search with allergen", async function() {
      let config1 = getConfig(30, 1, "_id", 1, "", [""], [""], undefined);
      let foods1 = await utils.findFoods(db, config1);
      let config2 = getConfig(
        30,
        1,
        "_id",
        1,
        "",
        ["en:milk"],
        [""],
        undefined
      );
      let foods2 = await utils.findFoods(db, config2);
      assert.strictEqual(foods1[1].allergens_tags.includes("en:milk"), true);
      for (let f of foods2) {
        assert.strictEqual(f.allergens_tags.includes("en:milk"), false);
      }
    });

    it("search allergen free food", async function() {
      let config1 = getConfig(30, 1, "_id", 1, "", [""], [""], undefined);
      let foods1 = await utils.findFoods(db, config1);
      let config2 = getConfig(30, 1, "_id", 1, "", ["none"], [""], undefined);
      let foods2 = await utils.findFoods(db, config2);
      assert.strictEqual(foods1[1].allergens_tags.includes("en:milk"), true);
      for (let f of foods2) {
        assert.strictEqual(f.allergens_tags.length, 0);
      }
    });

    it("search with additive", async function() {
      let config1 = getConfig(30, 1, "_id", 1, "", [""], [""], undefined);
      let foods1 = await utils.findFoods(db, config1);
      let config2 = getConfig(
        30,
        1,
        "_id",
        1,
        "",
        [""],
        ["en:e422"],
        undefined
      );
      let foods2 = await utils.findFoods(db, config2);
      assert.strictEqual(foods1[0].additives_tags.includes("en:e422"), true);
      for (let f of foods2) {
        assert.strictEqual(f.additives_tags.includes("en:e422"), false);
      }
    });

    it("search additive free food", async function() {
      let config1 = getConfig(30, 1, "_id", 1, "", [""], [""], undefined);
      let foods1 = await utils.findFoods(db, config1);
      let config2 = getConfig(30, 1, "_id", 1, "", [""], ["none"], undefined);
      let foods2 = await utils.findFoods(db, config2);
      assert.strictEqual(foods1[0].additives_tags.includes("en:e422"), true);
      for (let f of foods2) {
        assert.strictEqual(f.additives_tags.length, 0);
      }
    });

    it("search with shop", async function() {
      let config = getConfig(30, 1, "_id", 1, "", [""], [""], ["b"]);
      let foods = await utils.findFoods(db, config);
      for (let f of foods) {
        assert.strictEqual(f.stores_tags.includes("b"), true);
      }
    });
  });

  describe("update food", function() {
    let id = "00";
    let price = undefined;
    let shops = undefined;
    let entryDate = undefined;

    before(async function() {
      let food = await utils.findFoodById(db, id);
      price = food.pricing.price;
      shops = food.stores_tags;
      entryDate = food.pricing.entryDate_t;
    });

    afterEach(async function() {
      const collection = await db.collection("france");
      await collection.updateOne(
        { _id: id },
        {
          $set: {
            pricing: {
              price: price,
              entryDate_t: entryDate
            },
            stores_tags: shops
          }
        }
      );
    });

    it("update food price and add store", async function() {
      let pricing = {};
      pricing.price = price * 2;
      pricing.entryDate = entryDate + 1;
      pricing.store = shops[0] + shops[0];
      let food = await utils.updateFood(db, id, pricing);
      assert.strictEqual(food.pricing.price, price * 2);
      assert.strictEqual(food.pricing.entryDate_t, entryDate + 1);
      assert.strictEqual(food.stores_tags.includes(shops[0] + shops[0]), true);
    });

    it("update food price only", async function() {
      let pricing = {};
      pricing.price = price * 2;
      pricing.entryDate = entryDate + 1;
      pricing.store = "";
      let food = await utils.updateFood(db, id, pricing);
      assert.strictEqual(food.pricing.price, price * 2);
      assert.strictEqual(food.pricing.entryDate_t, entryDate + 1);
      assert.strictEqual(
        shops[shops.length - 1],
        food.stores_tags[food.stores_tags.length - 1]
      );
    });

    it("update food store only", async function() {
      let pricing = {};
      pricing.store = shops[0] + shops[0];
      let food = await utils.updateFood(db, id, pricing);
      assert.strictEqual(food.pricing.price, price);
      assert.strictEqual(food.pricing.entryDate_t, entryDate);
      assert.strictEqual(food.stores_tags.includes(shops[0] + shops[0]), true);
    });
  });

  describe("recipe", function() {
    afterEach(async function() {
      try {
        await db.collection("recipe").drop();
        await db.collection("comment").drop();
      } catch (error) {}
    });

    it("add recipe", async function() {
      let recipe = await utils.addRecipe(
        db,
        "recipeA",
        "authorA",
        ["milk", "egg"],
        "link"
      );
      assert.strictEqual(recipe.name, "recipeA");
      assert.strictEqual(recipe.author, "authorA");
      assert.strictEqual(recipe.ingredients.length, 2);
      assert.strictEqual(recipe.ingredients[0], "milk");
      assert.strictEqual(recipe.ingredients[1], "egg");
    });

    it("get recipes with 2 items per page", async function() {
      for (let i = 0; i < 5; i++) {
        await utils.addRecipe(
          db,
          "recipeA",
          "authorA",
          ["milk", "egg"],
          "link"
        );
      }
      let per_page = 2;
      let page = 1;
      let pagination = {};
      pagination.skip = per_page * (page - 1);
      pagination.limit = per_page;

      let recipes = await utils.getRecipes(db, pagination);
      assert.strictEqual(recipes.length, 2);
    });

    it("get different page recipes", async function() {
      for (let i = 0; i < 5; i++) {
        await utils.addRecipe(
          db,
          "recipeA",
          "authorA",
          ["milk", "egg"],
          "link"
        );
      }

      let per_page = 2;
      let page1 = 1;
      let page2 = 2;
      let pagination = {};
      let pagination2 = {};
      pagination.skip = per_page * (page1 - 1);
      pagination.limit = per_page;
      pagination2.skip = per_page * (page2 - 1);
      pagination2.limit = per_page;

      let recipes1 = await utils.getRecipes(db, pagination);
      let recipes2 = await utils.getRecipes(db, pagination2);
      assert.strictEqual(recipes1[0]._id.equals(recipes2[0]._id), false);
    });

    it("get recipes by id", async function() {
      let recipe = undefined;
      for (let i = 0; i < 5; i++) {
        recipe = await utils.addRecipe(
          db,
          "recipeA",
          "authorA",
          ["milk", "egg"],
          "link"
        );
      }
      let res = await utils.findRecipeById(db, recipe._id);
      assert.strictEqual(res._id.equals(recipe._id), true);
    });

    it("get recipe note", async function() {
      let recipe = await utils.addRecipe(
        db,
        "recipeA",
        "authorA",
        ["milk", "egg"],
        "link"
      );
      let per_page = 1;
      let page = 1;
      let pagination = {};
      pagination.skip = per_page * (page - 1);
      pagination.limit = per_page;
      await utils.addComment(db, 5, "authorA", "commentA", recipe._id);
      let recipes = await utils.getRecipes(db, pagination);
      assert.strictEqual(recipes[0].note, 5);
      await utils.addComment(db, 0, "authorA", "commentA", recipe._id);
      recipes = await utils.getRecipes(db, pagination);
      assert.strictEqual(recipes[0].note, 2.5);
    });
  });

  describe("comment", function() {
    let id = undefined;

    before(async function() {
      let recipe = await utils.addRecipe(
        db,
        "recipeA",
        "authorA",
        ["milk", "egg"],
        "link"
      );
      id = recipe._id;
    });

    afterEach(async function() {
      await db.collection("comment").drop();
    });

    after(async function() {
      await db.collection("recipe").drop();
    });

    it("add comment", async function() {
      let comment = await utils.addComment(db, 5, "authorA", "commentA", id);
      assert.strictEqual(comment.recipeId.equals(id), true);
      assert.strictEqual(comment.author, "authorA");
      assert.strictEqual(comment.note, 5);
      assert.strictEqual(comment.comment, "commentA");
    });

    it("get comments with 2 items per page", async function() {
      for (let i = 0; i < 5; i++) {
        await utils.addComment(db, 5, "authorA", "commentA", id);
      }
      let per_page = 2;
      let page = 1;
      let pagination = {};
      pagination.skip = per_page * (page - 1);
      pagination.limit = per_page;

      let comments = await utils.getComments(db, pagination, id);
      assert.strictEqual(comments.length, 2);
    });

    it("get different page comment", async function() {
      for (let i = 0; i < 5; i++) {
        await utils.addComment(db, 5, "authorA", "commentA", id);
      }

      let per_page = 2;
      let page1 = 1;
      let page2 = 2;
      let pagination = {};
      let pagination2 = {};
      pagination.skip = per_page * (page1 - 1);
      pagination.limit = per_page;
      pagination2.skip = per_page * (page2 - 1);
      pagination2.limit = per_page;

      let recipes1 = await utils.getComments(db, pagination, id);
      let recipes2 = await utils.getComments(db, pagination2, id);
      assert.strictEqual(recipes1[0]._id.equals(recipes2[0]._id), false);
    });
  });
});

function getConfig(
  per_page,
  page,
  sorted_by,
  order,
  product_name,
  allergen,
  additive,
  shop
) {
  let config = {};

  let pagination = {};
  pagination.skip = per_page * (page - 1);
  pagination.limit = per_page;

  let sorting = {};
  sorting.sorted_by = sorted_by;
  sorting.order = order;

  config.pagination = pagination;
  config.sorting = sorting;
  config.product_name = product_name;
  config.allergen = allergen;
  config.additive = additive;
  config.shop = shop;

  return config;
}
