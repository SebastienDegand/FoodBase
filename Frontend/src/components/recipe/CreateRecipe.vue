<template>
  <v-dialog v-bind:value="showDialogCreateRecipe" v-on:input="$emit('closeDialog')">
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
</template>

<script>
    export default {
        name: "CreateRecipe",
      props: {
        showDialogCreateRecipe: Boolean
      },
      data() {
          return {
            recipeField: "",
            nameRecipeField: "",
            imageUrlRecipeField: "",
            authorRecipeField: "",

            alergenes: [],
            modelAlergenes: [],

            additives: [],
            modelAdditives: []
          }
      },
      mounted() {
          this.getAllergens();
          this.getAdditives();
      },
      methods:{
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
            promises.push(fetch(process.env.BACKEND_API + '/foods?page=1&per_page=1&name=' + ingredient + searchCriteriaAPIParam).then((response) => {
              return response.json()
            }).then((data) => {
              if (data.length > 0)
                ingredientsFound.push(data[0].product_name);
            }))
          });
          Promise.all(promises).then(() => {
            fetch(process.env.BACKEND_API + '/recipes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ingredients: ingredientsFound,
                name: this.nameRecipeField,
                author: this.authorRecipeField,
                image_link: this.imageUrlRecipeField
              })
            }).then(() => {
              this.$emit('closeDialog');
              this.resetRecipeFields();
              this.$emit('updateRecipes');
            });
          })
        },
        resetRecipeFields() {
          this.recipeField = "";
          this.nameRecipeField= "";
          this.imageUrlRecipeField= "";
          this.authorRecipeField= "";
          this.modelAlergenes = [];
          this.modelAdditives = []
        },
        removeAlergene(item) {
          const index = this.modelAlergenes.indexOf(item);
          if (index >= 0) this.modelAlergenes.splice(index, 1)
        },
        removeAdditive(item) {
          const index = this.modelAdditives.indexOf(item);
          if (index >= 0) this.modelAdditives.splice(index, 1)
        },
        getAllergens () {
          fetch(process.env.BACKEND_API + '/allergens').then((response) => {
            return response.json()
          }).then((data) => {
            for(let allergen = 0; allergen<data.length; allergen++) {
              this.alergenes.push(data[allergen]._id)
            }
          })
        },
        getAdditives () {
          fetch(process.env.BACKEND_API + '/additives').then((response) => {
            return response.json()
          }).then((data) => {
            for(let additive = 0; additive<data.length; additive++) {
              this.additives.push(data[additive]._id)
            }
          })
        }
      },
      computed: {
        valid() {
          return this.recipeField !== "" && this.nameRecipeField !== "" && this.authorRecipeField !== "";
        }
      }
    }
</script>

<style scoped>

</style>
