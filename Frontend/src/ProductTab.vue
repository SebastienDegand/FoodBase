<template>
  <v-card>
    <v-card-title>
      Food
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="products"
      :hide-actions="true"
      :pagination.sync="paginationSync">

      <template slot="items" slot-scope="props">
        <tr @click="showAlert(props.item)">
        <td>{{ props.item.product_name }}</td>
        </tr>
      </template>

    </v-data-table>
    <div class="text-xs-center pt-2">
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
    </div>
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
            pagination: {
              currentPage: 1,
              totalPages: 4,
              possibleRowPerPage: [10, 20, 30]
            },
            paginationSync: {
              rowsPerPage: 10
            }
          }
        },
      mounted () {
        this.getProducts();
      },
      methods: {
          getProducts: function(page = 1, rowsPerPage = 10) {
            console.log("hello"); /////////
            console.log("current page: " + this.pagination.currentPage); //////////
            console.log("rows per page: " + this.paginationSync.rowsPerPage); //////////
            console.log("total pages: " + this.pagination.totalPages); //////////
            fetch('http://localhost:8080/api/v1/foods?page=' + page + '&per_page=' + rowsPerPage).then((response) => {
              return response.json()
            }).then((data) => {
              //this.products = data.filter(product => product.product_name);
              this.products = data;
            })
          },
          showAlert: function(item) {
            return alert(item.product_name)
          }
      },
      computed: {
          getProductsToShow () {
            return this.getProducts(this.pagination.currentPage, this.paginationSync.rowsPerPage);
      }
      }
    }
</script>

<style scoped>
  v-select {
    display: grid;
  }
</style>
