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
  getComments: getComments
};
