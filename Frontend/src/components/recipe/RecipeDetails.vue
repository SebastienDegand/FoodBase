<template>
  <v-dialog v-bind:value="showDialogRecipe" v-on:input="$emit('closeDialog')" v-if="recipeSelected">
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
</template>

<script>
    export default {
        name: "RecipeDetails",
      props: {
          recipeSelected: Object,
          showDialogRecipe: Boolean,
          comments: Array
      },
      data() {
          return {
            commentAuthorField: "",
            commentTextField: "",
            commentRating: 0
          }
      },
      methods: {
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
            this.$emit('updateComments');
          });
        },
        resetCommentFields() {
          this.commentAuthorField = "";
          this.commentRating = 0;
          this.commentTextField = "";
        }
      },
      computed: {
        validComment() {
          return this.commentAuthorField !== "" && this.commentTextField !== "";
        }
      }
    }
</script>

<style scoped>

</style>
