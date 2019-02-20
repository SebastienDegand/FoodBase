<template>
  <div>
    <v-dialog v-model="showDialog">
      <v-card v-if="itemSelected">
        <v-card-title>
          <span class="headline">{{itemSelected.product_name}}</span>
        </v-card-title>
        <v-card-text>
          fff
        </v-card-text>
      </v-card>
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
          <v-select
            v-model="filterModel"
            :items="filters"
            label="Filter By"
            outline
          ></v-select>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchField"
            label="Name of the product"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="blue" dark large @click="searchProducts()">Search</v-btn>
        </v-flex>
      </v-card-title>

      <table width="100%" id="myHeader" style="background-color: white; font-size: 15px; border-bottom: 2px solid #1c85ff;">
        <thead>
        <tr>
          <th style="width: 15vw; max-width: 15vw; min-width: 15vw">Product name</th>
          <th class="nutriment-row" v-for="header in h">{{header}}</th>
        </tr>
        </thead>
      </table>
      <table width="100%" style="font-size: 11px">
        <tbody>
        <div v-for="product in products" id="row-wrapper" @click="showDialog = true; itemSelected = product">
          <tr>
            <td style="width: 15vw; max-width: 15vw; min-width: 15vw; font-size: 16px">{{ product.product_name }}</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.sugars_100g">{{
              product.nutriments.sugars_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.salt_100g ">{{
              product.nutriments.salt_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.sodium_100g">{{
              product.nutriments.sodium_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.fiber_100g ">{{
              product.nutriments.fiber_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.carbohydrates_100g ">
              {{ product.nutriments.carbohydrates_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.fat_100g ">{{
              product.nutriments.fat_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.alcohol_100g ">{{
              product.nutriments.alcohol_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.energy_100g ">{{
              product.nutriments.energy_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.nutriments && product.nutriments.proteins_100g ">{{
              product.nutriments.proteins_100g.toString().substring(0,5) }}
            </td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
            <td class="text-xs-right nutriment-row" v-if="product.price">{{ product.price }}</td>
            <td class="text-xs-right nutriment-row" v-else>?</td>
          </tr>
          <hr>
        </div>
        </tbody>
      </table>

    </v-card>
  </div>
</template>

<script>
  export default {
    name: "ProductTab",
    data() {
      return {
        products: [],
        h: ['Sugar (100g)', 'Salt (100g)', 'Sodium (100g)', 'Fiber (100g)', 'Carbohydrates (100g)', 'Fat (100g)', 'Alcohol (100g)', 'Energy (100g)', 'Proteins (100g)', 'Price'],
        headers: [
          {
            text: 'Product name',
            align: 'left',
            sortable: false,
            value: 'product_name'
          },
          {text: 'Sugar (100g)', value: 'sugar'},
          {text: 'Salt (100g)', value: 'salt'},
          {text: 'Sodium (100g)', value: 'sodium'},
          {text: 'Fiber (100g)', value: 'fiber'},
          {text: 'Carbohydrates (100g)', value: 'carbohydrates'},
          {text: 'Fat (100g)', value: 'fat'},
          {text: 'Alcohol (100g)', value: 'alcohol'},
          {text: 'Energy (100g)', value: 'energy'},
          {text: 'Proteins (100g)', value: 'proteins'},
          {text: 'Price', value: 'price'}
        ],
        currentPage: 1,
        rowsPerPage: 60,
        loadingProduct: false,
        isLoading: false,

        searchCriteriaAPIParam: "",


        alergenes: ["milk", "egg", "egg", "nuts", "b", "c", "d", "e"],
        modelAlergenes: null,
        radioModelAlergenes: false,

        shops: ["carrefour", "auchan"],
        modelShop: null,
        radioModelShops: false,

        additives: ["E1XX", "E2XX"],
        modelAdditives: null,
        radioModelAdditives: false,

        filters: ["price", "nutrition value"],
        filterModel: null,

        searchField: "",

        showDialog: false,
        itemSelected: null,

        header: null,
        sticky: null
      }
    },
    mounted() {
      this.header = document.getElementById("myHeader");
      this.sticky = this.header.getBoundingClientRect().top;
      console.log(this.sticky);
      this.InitProducts();
      this.scroll();
    },
    methods: {
      InitProducts: function () {
        this.loadingProduct = true;
        this.currentPage = 1;
        this.rowsPerPage = 60;
        console.log('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage)
        fetch('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage).then((response) => {
          return response.json()
        }).then((data) => {
          //this.products = data.filter(product => product.product_name);
          this.products = data;
          this.loadingProduct = false;
        })
      },
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
        if (this.modelAlergenes && this.modelAlergenes.length > 0) {
          this.searchCriteriaAPIParam += "&allergen="
          this.modelAlergenes.forEach((alergen, index) => {
            if (index == 0)
              this.searchCriteriaAPIParam += alergen;
            else
              this.searchCriteriaAPIParam += "+" + alergen
          })
        }
        if (this.modelAdditives && this.modelAdditives.length > 0) {
          this.searchCriteriaAPIParam += "&additive="
          this.modelAdditives.forEach((additive, index) => {
            if (index == 0)
              this.searchCriteriaAPIParam += additive;
            else
              this.searchCriteriaAPIParam += "+" + additive
          })
        }
        if (this.modelShop && this.modelShop.length > 0) {
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
        console.log('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam + "&sorted_by=nutriments.sugars_100g&order=decreasing");
        fetch('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam + "&sorted_by=nutriments.sugars_100g&order=decreasing").then((response) => {
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
            this.header.classList.add("sticky");
          } else {
            this.header.classList.remove("sticky");
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
    },
    computed: {},
    beforeDestroy() {
      window.onscroll = null;
    }
  }
</script>

<style scoped>
  v-select {
    display: grid;
  }

  .sticky {
    position: fixed;
    top: 0;
    width: 100%;
  }

  .nutriment-row {
    width: 8vw;
    max-width: 8vw;
    min-width: 8vw;
  }

  #row-wrapper:hover {
    background: #838383;
    cursor: pointer;
  }


</style>
