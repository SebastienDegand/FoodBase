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
        <v-btn color="blue" dark large>Search</v-btn>
      </v-flex>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="products"
      :hide-actions="true">

      <template slot="items" slot-scope="props">
        <tr @click="showDialog = true; itemSelected = props.item">
        <td>{{ props.item.product_name }}</td>
        </tr>
      </template>

    </v-data-table>
  </v-card>
  </div>
</template>

<script>
    export default {
        name: "ProductTab",
        data () {
          return {
            products: [],
            headers: [
              {
                text: 'Product name',
                align: 'left',
                sortable: false,
                value: 'product_name'
              }
            ],
            currentPage: 1,
            rowsPerPage: 60,
            loadingProduct: false,
            isLoading: false,


            alergenes: ["milk", "egg", "egg", "a", "b", "c", "d", "e"],
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

            showDialog: false,
            itemSelected: null
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
            console.log(this.products)
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
        },
        removeAlergene (item) {
          const index = this.modelAlergenes.indexOf(item);
          if (index >= 0) this.modelAlergenes.splice(index, 1)
        },
        removeShop (item) {
          const index = this.modelShop.indexOf(item);
          if (index >= 0) this.modelShop.splice(index, 1)
        },
        removeAdditive (item) {
          const index = this.modelAdditives.indexOf(item);
          if (index >= 0) this.modelAdditives.splice(index, 1)
        },

        computeCriteria() {

        }
      },
      computed: {
      },
      beforeDestroy () {
          window.onscroll = null;
      }
    }
</script>

<style scoped>
  v-select {
    display: grid;
  }
</style>
