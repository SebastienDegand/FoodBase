<template>
  <div>
    <v-dialog v-model="showDialogRecipe">
      <v-card v-if="recipeSelected">
        <v-card-title>
          <span class="headline">{{recipeSelected.name}}</span>
        </v-card-title>
        <v-card-text>
          <div style="text-align: left" v-for="ingredient in recipeSelected.ingredients"> {{ingredient}}</div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDialogCreateRecipe">
      <v-card>
        <v-card-title>
          <span class="headline">Create Recipe</span>
        </v-card-title>
        <v-card-text>
          form to create a recipe
          <v-text-field
            v-model="recipeField"
            label="recipe to parse"
            required
          ></v-text-field>
          <v-text-field
            v-model="nameRecipeField"
            label="name of the recipe"
            required
          ></v-text-field>
          <v-text-field
            v-model="imageUrlRecipeField"
            label="image for the recipe"
          ></v-text-field>
          <v-text-field
            v-model="authorRecipeField"
            label="author"
            required
          ></v-text-field>
        </v-card-text>
        <v-autocomplete
          v-model="modelAlergenes"
          :items="alergenes"
          box
          chips
          color="orange"
          label="Search without alergenes"
          item-text="name"
          item-value="name"
          multiple
          :disabled="radioModelAlergenes"
        >
          <template
            slot="selection"
            slot-scope="data"
          >
            <v-chip
              :selected="data.selected"
              close
              class="chip--select-multi"
              @input="removeAlergene(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>
          <template
            slot="item"
            slot-scope="data"
          >
            <template>
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
          </template>
        </v-autocomplete>
        <v-autocomplete
          v-model="modelAdditives"
          :items="additives"
          box
          chips
          color="orange"
          label="Search without additives"
          item-text="name"
          item-value="name"
          multiple
          :disabled="radioModelAdditives"
        >
          <template
            slot="selection"
            slot-scope="data"
          >
            <v-chip
              :selected="data.selected"
              close
              class="chip--select-multi"
              @input="removeAdditive(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>
          <template
            slot="item"
            slot-scope="data"
          >
            <template>
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
          </template>
        </v-autocomplete>
        <v-btn
          :disabled="!valid"
          color="orange"
          style="color: white;"
          @click="addRecipe()"
        >
          Send Recipe
        </v-btn>
      </v-card>
    </v-dialog>
    <br>
    <v-btn
      color="orange"
      @click="showDialogCreateRecipe = true"
      style="color: white;"
    >
      Create a Recipe
    </v-btn>
    <br>

    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>

        <v-flex v-for="recipe in recipes" style="width: 300px">
          <v-card style="max-width: 375px">
            <v-img
              v-bind:src="(recipe.image_link && recipe.image_link !== '') ? recipe.image_link : 'https://cdn.vuetifyjs.com/images/cards/desert.jpg'"
              aspect-ratio="2.75"
            ></v-img>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{recipe.name}}</h3>
                <div style="font-size: small">by {{recipe.author}}</div>
              </div>
            </v-card-title>
            <div class="text-xs-center">
              <v-rating v-model="recipe.note" readonly color="orange" background-color="orange lighten-3"></v-rating>
            </div>
            <v-card-actions>
              <v-btn flat color="orange" @click="selectRecipe(recipe)">Select</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
    export default {
        name: "RecipeTab",
      data: () => ({
        recipes: [],
        currentPage: 1,
        rowsPerPage: 60,

        recipeSelected: null,
        showDialogRecipe: false,

        showDialogCreateRecipe: false,
        recipeField: "",
        nameRecipeField: "",
        imageUrlRecipeField: "",
        authorRecipeField: "",

        alergenes: ["milk", "egg", "egg", "nuts", "b", "c", "d", "e"],
        modelAlergenes: [],
        radioModelAlergenes: false,

        additives: ["E1XX", "E2XX"],
        modelAdditives: [],
        radioModelAdditives: false,
      }),
      mounted () {
          this.initRecipes();
      },
      methods: {
        initRecipes: function() {
          this.currentPage = 1;
          this.rowsPerPage = 60;
          fetch('http://localhost:8080/api/v1/recipes?page=' + this.currentPage + '&per_page=' + this.rowsPerPage).then((response) => {
            return response.json()
          }).then((data) => {
            this.recipes = data;
          })
        },
        selectRecipe(recipe) {
          this.recipeSelected = recipe;
          this.showDialogRecipe = true
        },
        removeAlergene(item) {
          const index = this.modelAlergenes.indexOf(item);
          if (index >= 0) this.modelAlergenes.splice(index, 1)
        },
        removeAdditive(item) {
          const index = this.modelAdditives.indexOf(item);
          if (index >= 0) this.modelAdditives.splice(index, 1)
        },
        addRecipe() {
          let searchCriteriaAPIParam = "";
          if (this.modelAlergenes.length > 0) {
            searchCriteriaAPIParam += "&allergen="
            this.modelAlergenes.forEach((alergen, index) => {
              if (index == 0)
                searchCriteriaAPIParam += alergen;
              else
                searchCriteriaAPIParam += "+" + alergen
            })
          }
          if (this.modelAdditives.length > 0) {
            searchCriteriaAPIParam += "&additive="
            this.modelAdditives.forEach((additive, index) => {
              if (index == 0)
                searchCriteriaAPIParam += additive;
              else
                searchCriteriaAPIParam += "+" + additive
            })
          }
          let ingredients = this.recipeField.split('&');
          let ingredientsFound = [];
          let promises = []
          ingredients.forEach((ingredient) => {
            promises.push(fetch('http://localhost:8080/api/v1/foods?page=1&per_page=1&name=' + ingredient + searchCriteriaAPIParam).then((response) => {
              return response.json()
            }).then((data) => {
              if(data.length > 0)
                ingredientsFound.push(data[0].product_name);
            }))
          })
          Promise.all(promises).then(() => {
            fetch('http://localhost:8080/api/v1/recipes', {
              method: 'POST',
              body: JSON.stringify({
                ingredients: ingredientsFound,
                name: this.nameRecipeField,
                author: this.authorRecipeField,
                image_link: this.imageUrlRecipeField
              })
            }).then(() => {
              this.showDialogCreateRecipe = false;
              this.initRecipes();
            });
          })
        }
      },
      computed: {
          valid () {
            return this.recipeField !== "" && this.nameRecipeField!== "" && this.authorRecipeField!== "";
          }
      }
    }
</script>

<style scoped>

</style>
