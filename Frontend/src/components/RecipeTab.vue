<template>
  <div>
    <v-dialog v-model="showDialogRecipe" v-if="recipeSelected">
      <div style="background-color: white">
      <v-layout row wrap>
        <v-flex xs8>
          <v-card color="primary">
            <v-card>
              <v-card-title>
                <span class="headline">{{recipeSelected.name}}</span>
              </v-card-title>
              <v-card-text style="text-align: left">
                <b style="font-size: 17px">Ingredients:</b>
                <br>
                <div v-for="ingredient in recipeSelected.ingredients">- {{ingredient}}</div>
              </v-card-text>
            </v-card>
          </v-card>
        </v-flex>

        <v-flex xs4>
          <div v-if="comments.length>0">
          <v-card>
            <v-layout row>
              <v-list>
                <v-card v-for="comment in comments" width="30vw">
                  <div style="text-align: left">
                    <div class="headline">By {{comment.author}}</div>
                    <div>{{comment.createTime}}</div>
                  </div>
                  <v-card-text>
                    {{comment.comment}}
                    <v-rating v-model="comment.note" readonly color="orange" background-color="orange lighten-3"></v-rating>
                  </v-card-text>
                </v-card>
              </v-list>
            </v-layout>
          </v-card>
          </div>
          <v-card>
            <v-text-field
              v-model="commentAuthorField"
              style="width: 50%;"
              label="author"
              required
            ></v-text-field>
            <v-text-field
              v-model="commentTextField"
              label="comment"
              required
            ></v-text-field>
            <v-rating
              v-model="commentRating"
              color="orange"
              background-color="grey"
              empty-icon="$vuetify.icons.ratingFull"
              hover
            ></v-rating>
            <v-btn
              :disabled="!validComment"
              color="orange"
              style="color: white;"
              @click="addComment(recipeSelected)"
            >Send comment</v-btn>
          </v-card>
        </v-flex>
      </v-layout>
      </div>
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

      additives: ["E1XX", "E2XX"],
      modelAdditives: [],

      comments: [],
      commentAuthorField: "",
      commentTextField: "",
      commentRating: 0
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
            if (data.length > 0)
              ingredientsFound.push(data[0].product_name);
          }))
        })
        Promise.all(promises).then(() => {
          fetch('http://localhost:8080/api/v1/recipes', {
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
            this.showDialogCreateRecipe = false;
            this.resetRecipeFields();
            this.initRecipes();
          });
        })
      },
      getComments(recipe) {
        fetch('http://localhost:8080/api/v1/recipes/' + recipe._id +'/comments').then((response) => {
          console.log(response.body)
          return response.json()
        }).then((data) => {
          this.comments = data;
        })
      },
      addComment(recipe) {
        fetch('http://localhost:8080/api/v1/recipes/' + recipe._id + '/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            comment: this.commentTextField,
            note: this.commentRating,
            author: this.commentAuthorField,
          })
        }).then(() => {
          this.resetCommentFields();
          this.getComments(recipe);
        });
      },
      resetCommentFields() {
        this.commentAuthorField = "";
        this.commentRating = 0;
        this.commentTextField = "";
      },
      resetRecipeFields() {
        this.recipeField = "";
        this.nameRecipeField= "";
        this.imageUrlRecipeField= "";
        this.authorRecipeField= "";
        this.modelAlergenes = [];
        this.modelAdditives = []
      }
    },
    computed: {
      valid() {
        return this.recipeField !== "" && this.nameRecipeField !== "" && this.authorRecipeField !== "";
      },
      validComment() {
        console.log(this.commentAuthorField !== "" && this.commentTextField !== "");
        return this.commentAuthorField !== "" && this.commentTextField !== "";
      }
    }
  }
</script>

<style scoped>

</style>
