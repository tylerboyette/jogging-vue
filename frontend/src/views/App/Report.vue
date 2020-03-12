<template>
  <v-container style="min-height:100%; padding:5%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="10">
        <v-data-table
          :headers="headers"
          :items="reports"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Weekly Report</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.week="{ item }">
             {{item._id.year}} - Wk {{item._id.week}}
          </template>
          <template v-slot:item.distance="{ item }">
            {{(item.totalDistance / item.count).toFixed(2)}} km
          </template>
          <template v-slot:item.speed="{ item }">
            {{item.totalDuration
            ? ((item.totalDistance / item.totalDuration) * 60).toFixed(2)
            : 0}} km/hr
          </template>
          <template v-slot:no-data>
            <p class='headline'>There's no entries!</p>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
          </template>
        </v-data-table>
        
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import * as constants from '@/store/constants'
import moment from 'moment';

export default {
  name: 'EntryList',

  data: () => ({
    headers: [
      {
        text: 'Week',
        align: 'start',
        sortable: false,
        value: 'week',
      },
      { text: 'Avg Distance (km)', value: 'distance', sortable: false },
      { text: 'Avg Speed (km/hr)', value:'speed', sortable: false},
    ],
  }),

  computed: {
    ...mapGetters([
      'currentUser',
      'reports'
    ]),
  },

  created () {
    if (this.currentUser.role=='manager'){
      this.$router.push({
        name: 'dashboard'
      })
    }
    else
      this.initialize()
  },
  methods: {
    ...mapActions({
      getReport: constants.ACTION_GET_REPORT,
    }),

    initialize () {
      this.getReport();
    },
  },
}
</script>