<template>
  <v-card>
    <v-card-title>
      Food
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="products"
      :hide-actions="true">

      <template slot="items" slot-scope="props">
        <tr @click="showAlert(props.item)">
        <td>{{ props.item.product_name }}</td>
        </tr>
      </template>

    </v-data-table>
    <!-- <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.currentPage"
                    :length="pagination.totalPages"
                    @input="getProductsToShow">
      </v-pagination>
      <v-flex xs1 sm1 d-flex>
        <v-select v-model="paginationSync.rowsPerPage"
          :items="pagination.possibleRowPerPage"
          label="per page"
        ></v-select>
      </v-flex>
    </div> -->
  </v-card>
</template>

<script>
    export default {
        name: "ProductTab",
        data () {
          return {
            headers: [
              {
                text: 'Product name',
                align: 'left',
                sortable: false,
                value: 'product_name'
              }
            ],
            products: [],
            currentPage: 1,
            rowsPerPage: 60,
            loadingProduct: false
          }
        },
      mounted () {
        this.InitProducts();
        this.scroll();
      },
      methods: {
          InitProducts: function() {
            this.loadingProduct = true;
            this.currentPage = 1;
            this.rowsPerPage = 60;
            fetch('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage).then((response) => {
              return response.json()
            }).then((data) => {
              //this.products = data.filter(product => product.product_name);
              this.products = data;
              this.loadingProduct = false;
            })
          },
        getNextProducts: function() {
          this.loadingProduct = true;
          this.currentPage++;
          fetch('http://localhost:8080/api/v1/foods?page=' + this.currentPage + '&per_page=' + this.rowsPerPage + "&lastid=" + this.products[this.products.length-1].id).then((response) => {
            return response.json()
          }).then((data) => {
            //this.products = data.filter(product => product.product_name);
            this.products = this.products.concat(data);
            this.loadingProduct = false;
          })
        },
          showAlert: function(item) {
            return alert(item.product_name)
          },
        scroll () {
          window.onscroll = () => {
            let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight >= document.documentElement.offsetHeight * 0.8

            if (bottomOfWindow && !this.loadingProduct) {
              this.getNextProducts()
            }
          }
        }
      },
      computed: {
      }
    }
</script>

<style scoped>
  v-select {
    display: grid;
  }
</style>
