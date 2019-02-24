<template>
  <div>
    <recipe-details :recipeSelected="recipeSelected" :showDialogRecipe="showDialogRecipe" :comments="comments" @updateComments="getComments(recipeSelected)" @closeDialog="showDialogRecipe = false"></recipe-details>

    <create-recipe :showDialogCreateRecipe="showDialogCreateRecipe" @closeDialog="showDialogCreateRecipe = false" @updateRecipes="initRecipes"></create-recipe>
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
  import CreateRecipe from "./recipe/CreateRecipe";
  import RecipeDetails from "./recipe/RecipeDetails";
  export default {
    name: "RecipeTab",
    components: {RecipeDetails, CreateRecipe},
    data: () => ({
      recipes: [],
      currentPage: 1,
      rowsPerPage: 60,

      recipeSelected: null,

      showDialogRecipe: false,

      showDialogCreateRecipe: false,

      comments: [],
    }),
    mounted() {
      this.initRecipes();
    },
    methods: {
      initRecipes: function () {
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
        this.showDialogRecipe = true;
        this.getComments(recipe);
      },
      getComments(recipe) {
        fetch('http://localhost:8080/api/v1/recipes/' + recipe._id +'/comments').then((response) => {
          console.log(response.body)
          return response.json()
        }).then((data) => {
          this.comments = data;
        })
      },
    }
  }
</script>

<style scoped>

</style>
