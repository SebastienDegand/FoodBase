<template>
  <div>
    <product-details @closeDialog="showDialog = false" @updateProducts="searchProducts" :itemSelected="itemSelected" :headers="headers" :showDialog="showDialog"></product-details>


    <v-card>
      <search-tools @searchProducts="searchEvent"></search-tools>

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

            <td class="text-xs-right nutriment-row" v-for="header in headers" v-if="header.enabled && product[header.id.split('.')[0]] && (product[header.id.split('.')[0]][header.id.split('.')[1]] || !isNaN(product[header.id.split('.')[0]][header.id.split('.')[1]]))">{{
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
  import ProductDetails from "./product/ProductDetails";
  import SearchTools from "./product/SearchTools";
  export default {
    name: "ProductTab",
    components: {SearchTools, ProductDetails},
    data() {
      return {
        products: [],
        headers: [{name: 'Sugar (100g)', enabled: false, filter: 0, id: 'nutriments.sugars_100g'},
          {name: 'Salt (100g)', enabled: false, filter: 0, id: 'nutriments.salt_100g'},
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
        let filterCriteriaAPIParam = "";
        this.headers.forEach((header) => {
          if(header.filter == -1) {
            filterCriteriaAPIParam += '&sorted_by=' + header.id + '&order=increasing'
          } else if(header.filter == 1) {
            filterCriteriaAPIParam += '&sorted_by=' + header.id + '&order=decreasing'
          }
        });
        console.log(process.env.BACKEND_API + '/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage  + this.searchCriteriaAPIParam + filterCriteriaAPIParam)
        fetch(process.env.BACKEND_API + '/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam + filterCriteriaAPIParam).then((response) => {
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
        let filterCriteriaAPIParam = "";
        this.headers.forEach((header) => {
          if(header.filter == -1) {
            filterCriteriaAPIParam += '&sorted_by=' + header.id + '&order=increasing'
          } else if(header.filter == 1) {
            filterCriteriaAPIParam += '&sorted_by=' + header.id + '&order=decreasing'
          }
        });
        console.log(process.env.BACKEND_API + '/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam + filterCriteriaAPIParam);
        fetch(process.env.BACKEND_API + '/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + this.searchCriteriaAPIParam + filterCriteriaAPIParam).then((response) => {
          return response.json()
        }).then((data) => {
          //this.products = data.filter(product => product.product_name);
          this.products = data;
          this.loadingProduct = false;
          console.log(this.products)
          console.log((this.products[4]["scoring"] && (this.products[4]['scoring']['score'] || !isNaN(this.products[4]['scoring']['score']))));
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
      getArrow(header) {
        if(header.filter == -1)
          return '\u2193';
        else if(header.filter == 1)
          return '\u2191';
        else
          return '';
      },
      searchEvent(e) {
        this.searchCriteriaAPIParam = e;
        this.searchProducts();
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
