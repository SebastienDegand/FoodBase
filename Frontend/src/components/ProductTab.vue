<template>
  <div>
    <v-dialog v-model="showDialog" v-if="itemSelected">
      <div style="background-color: white">
        <v-layout row wrap>
          <v-flex xs4>
            <v-card >
              <v-card-title>
                <span class="headline">{{itemSelected.product_name}}</span>
              </v-card-title>
              <v-card-text>
                <div style="text-align: left" v-for="header in headers">
                  <span v-if="header.name === 'Price' && itemSelected[header.id.split('.')[0]]&& itemSelected[header.id.split('.')[0]][header.id.split('.')[1]]">{{header.name}}: <input style="border: 2px solid dodgerblue" v-model="itemSelected[header.id.split('.')[0]][header.id.split('.')[1]]"> <button type="button" style="color: white; background-color: dodgerblue; padding: 2px" @click="updatePriceProduct">update</button></span>
                  <span v-else-if="itemSelected[header.id.split('.')[0]]&& itemSelected[header.id.split('.')[0]][header.id.split('.')[1]]">{{header.name}}: {{itemSelected[header.id.split('.')[0]][header.id.split('.')[1]].toString().substring(0,5) }}</span>
                  <span v-else>{{header.name}}: ?</span>
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


    <v-card>
      <v-card-title>

        <v-autocomplete
          v-model="modelAlergenes"
          :items="alergenes"
          box
          chips
          color="blue-grey lighten-2"
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

        <v-radio-group v-model="radioModelAlergenes">
          <v-radio
            :key="0"
            :label="`some`"
            :value="false"
          ></v-radio>
          <v-radio
            :key="1"
            :label="`any`"
            :value="true"
          ></v-radio>
        </v-radio-group>

        <v-spacer></v-spacer>

        <v-autocomplete
          v-model="modelShop"
          :items="shops"
          box
          chips
          color="blue-grey lighten-2"
          label="Select shops"
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
              @input="removeShop(data.item)"
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

        <v-spacer></v-spacer>

        <v-autocomplete
          v-model="modelAdditives"
          :items="additives"
          box
          chips
          color="blue-grey lighten-2"
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

        <v-radio-group v-model="radioModelAdditives">
          <v-radio
            :key="0"
            :label="`some`"
            :value="false"
          ></v-radio>
          <v-radio
            :key="1"
            :label="`any`"
            :value="true"
          ></v-radio>
        </v-radio-group>

      </v-card-title>

      <v-card-title>
        <v-flex xs12 sm6 d-flex>
          <v-text-field
            v-model="searchField"
            label="Name of the product"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="blue" dark large @click="searchProducts()">Search</v-btn>
        </v-flex>
      </v-card-title>
      <v-card-title>
      <v-checkbox v-for="header in headers"
                  v-model="header.enabled"
                  :label="header.name"
      ></v-checkbox>
      </v-card-title>

      <div class="container-table">
      <table id="myHeader" style="table-layout: fixed; background-color: white; font-size: 15px; border-bottom: 2px solid #1c85ff;">
        <div style="width: 100%">
        <tr>
          <th class="product-name-row">Product name</th>
          <th @click="selectFilterColumn(header.name)" style="cursor: ns-resize" class="nutriment-row" v-for="header in headers" v-if="header.enabled">{{header.name}} <b>{{getArrow(header)}}</b></th>
        </tr>
        </div>
      </table>
      <table width="100%" style="font-size: 11px">
        <tbody>
        <div v-for="product in products" id="row-wrapper" @click="showDialog = true; itemSelected = product">
          <tr>
            <td class="product-name-row" style="font-size: 16px">{{ product.product_name }}</td>

            <td class="text-xs-right nutriment-row" v-for="header in headers" v-if="header.enabled && product[header.id.split('.')[0]]&& product[header.id.split('.')[0]][header.id.split('.')[1]]">{{
              product[header.id.split('.')[0]][header.id.split('.')[1]].toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else-if="header.enabled">?</td>
          </tr>
          <hr>
        </div>
        </tbody>
      </table>
      </div>

    </v-card>
  </div>
</template>

<script>
  export default {
    name: "ProductTab",
    data() {
      return {
        products: [],
        headers: [{name: 'Sugar (100g)', enabled: false, filter: 0, id: 'nutriments.sugars_100g'},
          {name: 'Salt (100g)', enabled: false, filter: 0, id: 'nutriments.salt_100g '},
          {name: 'Sodium (100g)', enabled: false, filter: 0, id: 'nutriments.sodium_100g'},
          {name: 'Fiber (100g)', enabled: false, filter: 0, id: 'nutriments.fiber_100g'},
          {name: 'Carbohydrates (100g)', enabled: false, filter: 0, id: 'nutriments.carbohydrates_100g'},
          {name: 'Fat (100g)', enabled: false, filter: 0, id: 'product.nutriments.fat_100g'},
          {name: 'Alcohol (100g)', enabled: false, filter: 0, id: 'nutriments.alcohol_100g'},
          {name: 'Energy (100g)', enabled: false, filter: 0, id: 'nutriments.energy_100g'},
          {name: 'Proteins (100g)', enabled: false, filter: 0, id: 'nutriments.proteins_100g'},
          {name: 'Score', enabled: true, filter: 0, id: 'scoring.score'},
          {name: 'Price', enabled: true, filter: 0, id: 'pricing.price'}
          ],
        //h: [{name: 'Sugar (100g)', enabled: true}, {name: 'Salt (100g)', enabled: true}, {name: 'Sodium (100g)', enabled: true}, {name: 'Fiber (100g)', enabled: true}, {name: 'Carbohydrates (100g)', enabled: true}, {name: 'Fat (100g)', enabled: true}, {name: 'Alcohol (100g)', enabled: true}, {name: 'Energy (100g)', enabled: true}, {name: 'Proteins (100g)', enabled: false}, {name: 'Score', enabled: false}, {name: 'Price', enabled: true}],
        currentPage: 1,
        rowsPerPage: 60,
        loadingProduct: false,

        searchCriteriaAPIParam: "",


        alergenes: ["milk", "egg", "egg", "nuts", "b", "c", "d", "e"],
        modelAlergenes: [],
        radioModelAlergenes: false,

        shops: ["carrefour", "auchan"],
        modelShop: [],
        radioModelShops: false,

        additives: ["E1XX", "E2XX"],
        modelAdditives: [],
        radioModelAdditives: false,

        searchField: "",

        showDialog: false,
        itemSelected: null,

        header: null,
        sticky: null
      }
    },
    mounted() {
      this.headerElement = document.getElementById("myHeader");
      this.sticky = this.headerElement.getBoundingClientRect().top;
      this.searchProducts()
      this.scroll();
    },
    methods: {
      getNextProducts: function () {
        this.loadingProduct = true;
        this.currentPage++;
        console.log('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + "&lastid=" /*+ this.products[this.products.length-1].id*/ + this.searchCriteriaAPIParam)
        fetch('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + "&lastid=" /*+ this.products[this.products.length-1].id*/ + this.searchCriteriaAPIParam).then((response) => {
          return response.json()
        }).then((data) => {
          //this.products = data.filter(product => product.product_name);
          this.products = this.products.concat(data);
          this.loadingProduct = false;
          console.log(this.products)
        })
      },
      searchProducts: function () {
        this.loadingProduct = true;
        this.currentPage = 1;
        this.rowsPerPage = 60;
        this.searchCriteriaAPIParam = "";
        if (this.modelAlergenes.length > 0) {
          this.searchCriteriaAPIParam += "&allergen="
          this.modelAlergenes.forEach((alergen, index) => {
            if (index == 0)
              this.searchCriteriaAPIParam += alergen;
            else
              this.searchCriteriaAPIParam += "+" + alergen
          })
        }
        if (this.modelAdditives.length > 0) {
          this.searchCriteriaAPIParam += "&additive="
          this.modelAdditives.forEach((additive, index) => {
            if (index == 0)
              this.searchCriteriaAPIParam += additive;
            else
              this.searchCriteriaAPIParam += "+" + additive
          })
        }
        if (this.modelShop.length > 0) {
          this.searchCriteriaAPIParam += "&shop="
          this.modelShop.forEach((shop, index) => {
            if (index == 0)
              this.searchCriteriaAPIParam += shop;
            else
              this.searchCriteriaAPIParam += "+" + shop
          })
        }
        if (this.searchField !== "") {
          this.searchCriteriaAPIParam += "&name=" + this.searchField;
        }
        this.headers.forEach((header) => {
          if(header.filter == -1) {
            this.searchCriteriaAPIParam += '&sorted_by=' + header.id + '&order=increasing'
          } else if(header.filter == 1) {
            this.searchCriteriaAPIParam += '&sorted_by=' + header.id + '&order=decreasing'
          }
        });
        console.log('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam);
        fetch('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam).then((response) => {
          return response.json()
        }).then((data) => {
          //this.products = data.filter(product => product.product_name);
          this.products = data;
          this.loadingProduct = false;
          console.log(this.products)
        })
      },
      scroll() {
        window.onscroll = () => {
          let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight >= document.documentElement.offsetHeight * 0.8

          if (bottomOfWindow && !this.loadingProduct) {
            this.getNextProducts()
          }
          if (window.pageYOffset > this.sticky) {
            this.headerElement.classList.add("sticky");
          } else {
            this.headerElement.classList.remove("sticky");
          }
        }
      },
      removeAlergene(item) {
        const index = this.modelAlergenes.indexOf(item);
        if (index >= 0) this.modelAlergenes.splice(index, 1)
      },
      removeShop(item) {
        const index = this.modelShop.indexOf(item);
        if (index >= 0) this.modelShop.splice(index, 1)
      },
      removeAdditive(item) {
        const index = this.modelAdditives.indexOf(item);
        if (index >= 0) this.modelAdditives.splice(index, 1)
      },
      selectFilterColumn(colName) {
        this.headers.forEach((col, index) => {
          if(col.name === colName) {
            if(col.filter == 0)
              this.headers[index].filter = -1;
            else if(col.filter == -1)
              this.headers[index].filter = 1;
            else
              this.headers[index].filter = 0;
          } else {
            this.headers[index].filter = 0;
          }
        });
        this.searchProducts();
      },
      updatePriceProduct() {
        if(!isNaN(this.itemSelected.pricing.price)) {
          console.log(this.itemSelected.pricing.price)
          fetch('http://localhost:8080/api/v1/foods/' + this.itemSelected._id , {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              price: parseInt(this.itemSelected.pricing.price),
            })
          }).then(() => {
            this.showDialog = false;
            this.searchProducts()
          });
        }
      },
      getArrow(header) {
        if(header.filter == -1)
          return '\u2193';
        else if(header.filter == 1)
          return '\u2191';
        else
          return '';
      },
      showAlert(msg) {
        alert(msg)
      }
    },
    computed: {
    },
    beforeDestroy() {
      window.onscroll = null;
    }
  }
</script>

<style scoped>
  element {
    --number-col-selected: 5;
  }

  v-select {
    display: grid;
  }

  .sticky {
    position: fixed;
    top: 0;
    width: 100%;
  }

  .nutriment-row {
    width: 33vw;
    min-width: 8vw;
  }
  .product-name-row {
    width: 33vw;
    min-width: 15vw;
  }

  #row-wrapper:hover {
    background: #838383;
    cursor: pointer;
  }

  .container-table {
    overflow-x: auto;
  }


</style>
