<template>
  <v-dialog v-bind:value="showDialog" v-on:input="$emit('closeDialog')" v-if="itemSelected">
    <div style="background-color: white">
      <v-layout row wrap>
        <v-flex xs4>
          <v-card >
            <v-card-title>
              <span class="headline">{{itemSelected.product_name}}</span>
            </v-card-title>
            <v-card-text>
              <div style="text-align: left" v-for="header in headers">
                <span v-if="header.name === 'Price'">{{header.name}}: <input style="border: 2px solid dodgerblue" v-model="itemSelected[header.id.split('.')[0]][header.id.split('.')[1]]"> <button type="button" style="color: white; background-color: dodgerblue; padding: 2px" @click="updatePriceProduct">update</button></span>
                <span v-else-if="itemSelected[header.id.split('.')[0]]&& (itemSelected[header.id.split('.')[0]][header.id.split('.')[1]] || !isNaN(itemSelected[header.id.split('.')[0]][header.id.split('.')[1]]))">{{header.name}}: {{itemSelected[header.id.split('.')[0]][header.id.split('.')[1]].toString().substring(0,5) }}</span>
                <span v-else>{{header.name}}: ?</span>
              </div>
            </v-card-text>
          </v-card>

          <v-card >
            <v-card-title>
              <span class="headline">Shops</span>
            </v-card-title>
            <v-card-text>
              <div style="text-align: left" v-for="shop in itemSelected.stores_tags">
                <span>{{shop}}</span>
              </div>
              <div>
                <input style="border: 2px solid dodgerblue" v-model="shopToBeAdded"><button type="button" style="color: white; background-color: dodgerblue; padding: 2px" @click="addShop">add shop</button>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs4 v-if="itemSelected.ingredients.length > 0">
          <v-card >
            <v-card-text>
              <span style="font-size: 20px;">Ingredients</span>
              <div style="text-align: left" v-for="ingredient in itemSelected.ingredients"> {{ingredient.text}}</div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </v-dialog>
</template>

<script>
    export default {
        name: "ProductDetails",
      props: {
        itemSelected: Object,
        headers: Array,
        showDialog: Boolean
      },
      data () {
          return {
            shopToBeAdded: ""
          }
      },
      methods: {
        updatePriceProduct() {
          if(!isNaN(this.itemSelected.pricing.price)) {
            fetch(process.env.BACKEND_API + '/foods/' + this.itemSelected._id , {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                price: parseFloat(this.itemSelected.pricing.price),
              })
            }).then(() => {
              this.$emit('closeDialog');
              this.$emit('updateProducts');
            });
          }
        },
        addShop() {
          fetch(process.env.BACKEND_API + '/foods/' + this.itemSelected._id , {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              store: this.shopToBeAdded,
            })
          }).then(() => {
            this.$emit('closeDialog');
            this.$emit('updateProducts');
          });
        }
      }
    }
</script>

<style scoped>

</style>
