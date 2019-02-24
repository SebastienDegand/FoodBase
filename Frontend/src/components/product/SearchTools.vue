<template>
  <div>
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
        <v-btn color="blue" dark large @click="search()">Search</v-btn>
      </v-flex>
    </v-card-title>
  </div>
</template>

<script>
    export default {
        name: "SearchTools",
      data() {
          return {
            alergenes: [],
            modelAlergenes: [],
            radioModelAlergenes: false,

            shops: [],
            modelShop: [],
            radioModelShops: false,

            additives: [],
            modelAdditives: [],
            radioModelAdditives: false,

            searchField: "",
          }
      },
      mounted () {
        this.getAdditives();
        this.getAllergens();
        this.getShops();
      },
      methods: {
          search() {
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
            if (this.modelShop.length > 0) {
              searchCriteriaAPIParam += "&shop="
              this.modelShop.forEach((shop, index) => {
                if (index == 0)
                  searchCriteriaAPIParam += shop;
                else
                  searchCriteriaAPIParam += "+" + shop
              })
            }
            if (this.searchField !== "") {
              searchCriteriaAPIParam += "&name=" + this.searchField;
            }

            this.$emit("searchProducts", searchCriteriaAPIParam);
          },
        getAllergens () {
          fetch(process.env.BACKEND_API + '/allergens').then((response) => {
            return response.json()
          }).then((data) => {
            for(let allergen = 0; allergen<data.length; allergen++) {
              this.alergenes.push(data[allergen]._id)
            }
          })
        },
        getAdditives () {
          fetch(process.env.BACKEND_API + '/additives').then((response) => {
            return response.json()
          }).then((data) => {
            for(let additive = 0; additive<data.length; additive++) {
              this.additives.push(data[additive]._id)
            }
          })
        },
        getShops () {
          fetch(process.env.BACKEND_API + '/shops').then((response) => {
            return response.json()
          }).then((data) => {
            for(let shop = 0; shop<data.length; shop++) {
              this.shops.push(data[shop]._id)
            }
          })
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
      }
    }
</script>

<style scoped>

</style>
