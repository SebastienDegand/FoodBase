const ObjectId = require("mongodb").ObjectId;

async function findFoods(db, config) {
  const collection = await db.collection("france");
  let result = [];
  await collection
    .find({
      $and: [
        { product_name: { $ne: null } },
        { product_name: new RegExp(config.product_name) },
        { allergens_tags: { $nin: config.allergen } },
        { additives_tags: { $nin: config.additive } }
      ]
    })
    .sort({ [config.sorting.sorted_by]: config.sorting.order })
    .limit(config.pagination.limit)
    .skip(config.pagination.skip)
    .forEach(async doc => {
      if (config.shop) {
        if (!doc.stores_tags) {
          return;
        }
        for (let s of config.shop) {
          if (!doc.stores_tags.includes(s)) {
            return;
          }
        }
      }
      if (config.allergen[0] === "none" && doc.allergens_tags.length != 0) {
        return;
      }
      if (config.additive[0] === "none" && doc.additives_tags.length != 0) {
        return;
      }
      result.push(doc);
    });
  return result;
}

async function findFoodById(db, id) {
  const collection = await db.collection("france");
  const food = await collection.findOne({ _id: id });
  return food;
}

async function findRecipeById(db, id) {
  const collection = await db.collection("recipe");
  const result = await collection.findOne({ _id: ObjectId(id) });
  return result;
}

async function updateFood(db, id, pricing) {
  const collection = await db.collection("france");
  if (pricing.price) {
    await collection.updateOne(
      { _id: id },
      {
        $set: {
          pricing: {
            price: pricing.price,
            entryDate_t: pricing.entryDate
          }
        }
      }
    );
  }
  if (pricing.store != "") {
    await collection.updateOne(
      { _id: id },
      {
        $addToSet: { stores_tags: pricing.store }
      }
    );
  }

  const food = await collection.findOne({ _id: id });
  return food;
}

async function addRecipe(db, name, author, ingredients, image_link) {
  const collection = await db.collection("recipe");
  const result = await collection.insertOne({
    name: name,
    author: author,
    ingredients: ingredients,
    image_link: image_link,
    createTime: new Date().toISOString()
  });
  return result.ops[0];
}

async function getRecipes(db, pagination) {
  const recipeCollection = await db.collection("recipe");
  const commentCollection = await db.collection("comment");
  let result = await recipeCollection
    .find({})
    .limit(pagination.limit)
    .skip(pagination.skip)
    .toArray();
  for (let doc of result) {
    let avgNote = await commentCollection
      .aggregate([
        { $match: { recipeId: ObjectId(doc._id) } },
        { $group: { _id: doc._id, note: { $avg: "$note" } } }
      ])
      .toArray();
    doc.note = avgNote[0] ? avgNote[0].note : 0;
  }
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
  return result.ops[0];
}

async function getComments(db, pagination, recipeId) {
  const collection = await db.collection("comment");
  let result;
  result = await collection
    .find({ recipeId: ObjectId(recipeId) })
    .limit(pagination.limit)
    .skip(pagination.skip)
    .toArray();
  return result;
}

async function createShopCollection(db) {
  const collection = await db.collection("france");
  const shop = await db.collection("shop");
  var progression = 0;
  collection.find().forEach(function(t) {
    progression += 1;
    t.stores_tags.forEach(function(e) {
      shop.insertOne({
        _id: e
      }).catch(function(err) {
        // duplicate key, just skip it
      });
      
    })
    console.log("Progression: " + progression);
  })
  console.log("Succesfully created shop collection");
}

async function getShops(db) {
  const collection = await db.collection("shop");
  let result;
  result = await collection
    .find()
    .toArray();
  return result;
}

async function createAllergensCollection(db) {
  const collection = await db.collection("france");
  const allergens = await db.collection("allergen");
  var progression = 0;
  collection.find().forEach(function(t) {
    progression += 1;
    t.allergens_tags.forEach(function(e) {
      let a = e.substring(3, e.length);
      allergens.insertOne({
        _id: a
      }).catch(function(err) {
        // duplicate key, just skip it
      });
    });
    console.log("Progression: " + progression);
  })
  console.log("Succesfully created allergens collection");
}

async function getAllergens(db) {
  const collection = await db.collection("allergen");
  let result;
  result = await collection
    .find()
    .toArray();
  return result;
}

async function createAdditivesCollection(db) {
  const collection = await db.collection("france");
  const additives = await db.collection("additive");
  var progression = 0;
  collection.find().forEach(function(t) {
    progression += 1;
    t.additives_tags.forEach(function(e) {
      let a = e.substring(3, e.length);
      additives.insertOne({
        _id: a
      }).catch(function(err) {
        // duplicate key, just skip it
      });
    });
    console.log("Progression: " + progression);
  })
  console.log("Succesfully created additives collection");
}

async function getAdditives(db) {
  const collection = await db.collection("additive");
  let result;
  result = await collection
    .find()
    .toArray();
  return result;
}

module.exports = {
  findFoods: findFoods,
  findFoodById: findFoodById,
  findRecipeById: findRecipeById,
  updateFood: updateFood,
  addRecipe: addRecipe,
  getRecipes: getRecipes,
  addComment: addComment,
  getComments: getComments,
  createShopCollection: createShopCollection,
  getShops: getShops,
  createAllergensCollection: createAllergensCollection,
  getAllergens: getAllergens,
  createAdditivesCollection: createAdditivesCollection,
  getAdditives: getAdditives
};
