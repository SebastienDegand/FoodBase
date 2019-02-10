<template>
  <div>
    <br>

    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>

        <v-flex v-for="recipe in recipes" style="width: 300px">
          <v-card style="max-width: 375px">
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
              aspect-ratio="2.75"
            ></v-img>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{recipe.name}}</h3>
                <div style="font-size: small">by {{recipe.author}}</div>
              </div>
            </v-card-title>
            <div class="text-xs-center">
              <v-rating value="4" readonly></v-rating>
            </div>
            <v-card-actions>
              <v-btn flat color="orange">Share</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
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
        rowsPerPage: 60
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
            console.log(this.recipes);
          })
        }
      }
    }
</script>

<style scoped>

</style>
