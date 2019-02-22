<template>
<div>
  <v-toolbar>
    <v-toolbar-title>FoodBase</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn @click="productClick()" flat>Produits</v-btn>
      <v-btn @click="recipClick()" flat>Recette</v-btn>
      <v-btn @click="mapClick()" flat>Carte</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <h1 v-if="this.isProduct"><product-tab></product-tab></h1>
  <h1 v-if="this.isRecip"><recipe-tab></recipe-tab></h1>
  <h1 v-if="this.isMap"><GoogleMap></GoogleMap></h1>
</div>
</template>

<script>

import ProductTab from "./ProductTab";
import RecipeTab from "./RecipeTab";
import GoogleMap from "./GoogleMap"; 
export default {


	data() {

		return {
			isProduct : true,
            isRecip : false,
            isMap : false
		}
	},methods: {
        productClick: function () {
            this.isProduct = true
            this.isRecip = false
            this.isMap = false
        },
        recipClick: function () {
            this.isProduct = false
            this.isRecip = true
            this.isMap = false
        },
        mapClick: function () {
            this.isProduct = false

            this.isRecip = false
            this.isMap = true
        }
    },
	components: {
    RecipeTab,
    ProductTab,
    GoogleMap
	}
}
</script>

<style scoped>
</style>
