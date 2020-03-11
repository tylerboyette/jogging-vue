<template>
  <v-container style="min-height:100%; padding:5%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="10">
        <v-data-table
          :headers="headers"
          :items="entries"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Entry List</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">
                    <v-icon left>mdi-account-plus</v-icon>
                    New Entry
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <form>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-menu
                              ref="menu1"
                              v-model="menu1"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="editedItem.date"
                                  readonly
                                  label="Date"
                                  :error-messages="dateErrors"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="date" no-title @input="menu1 = false, $v.editedItem.date.$touch()"></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field 
                              v-model="editedItem.distance" 
                              suffix='km'
                              label="Distance"
                              :error-messages="distanceErrors"
                              required
                              @input="$v.editedItem.distance.$touch()"
                              @blur="$v.editedItem.distance.$touch()"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field 
                              v-model="editedItem.duration" 
                              label="Duration"
                              suffix='mins'
                              :error-messages="durationErrors"
                              required
                              @input="$v.editedItem.duration.$touch()"
                              @blur="$v.editedItem.duration.$touch()"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </form>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.date="{ item }">
            {{showDate(item.date)}}
          </template>
          <template v-slot:item.speed="{ item }">
            {{item.duration
            ? ((item.distance / item.duration) * 60).toFixed(2)
            : item.duration}} km/hr
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              class="mr-2"
              color='blue'
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              @click="deleteItem(item)"
              color='red'
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <p class='headline'>There's no entries!</p>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
          </template>
        </v-data-table>
        <v-dialog
            v-model="confirm_dialog"
            width="500"
          >
            <v-card>
              <v-card-title
              >
                Are you sure you want to delete this entry?
              </v-card-title>

              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="saveDelete">Yes</v-btn>
                <v-btn color="blue darken-1" text @click="closeDelete">No</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import * as constants from '@/store/constants'
import { validationMixin } from 'vuelidate'
import moment from 'moment';
import { required, integer } from 'vuelidate/lib/validators'

export default {
  name: 'EntryList',
  mixins: [validationMixin],
  validations: {
    editedItem:{
      date: { required },
      distance: { required, integer },
      duration: { required, integer }
    }
  },
  data: () => ({
    dialog: false,
    menu1:false,
    date:null,
    confirm_dialog:false,
    roles:['user','manager'],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'user.name',
      },
      { text: 'Date', value: 'date' },
      { text: 'Distance (km)', value: 'distance' },
      { text: 'Duration (mins)', value: 'duration' },
      { text: 'Avg Speed (km/hr)', value:'speed', sortable: false},
      { text: 'Action', value: 'action', sortable: false },
    ],
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      date: '',
      distance: 0,
      duration:0,
    },
    defaultItem: {
      date: '',
      distance: 0,
      duration:0,
    },
  }),

  computed: {
    ...mapGetters([
      'currentUser',
      'entries'
    ]),
    formTitle () {
      return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
    },
    dateErrors () {
      const errors = []
      if (!this.$v.editedItem.date.$dirty) return errors
      !this.$v.editedItem.date.required && errors.push('Date is required.')
      return errors
    },
    distanceErrors () {
      const errors = []
      if (!this.$v.editedItem.distance.$dirty) return errors
      !this.$v.editedItem.distance.required && errors.push('Distance is required')
      !this.$v.editedItem.distance.integer && errors.push('Distance is integer')
      this.editedItem.distance==0 && errors.push('Distance is more than 0.')
      return errors
    },
    durationErrors () {
      const errors = []
      if (!this.$v.editedItem.duration.$dirty) return errors
      !this.$v.editedItem.duration.required && errors.push('Duration is required')
      !this.$v.editedItem.duration.integer && errors.push('Duration is integer')
      this.editedItem.duration==0 && errors.push('Duration is more than 0.')
      return errors
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    date(val){
      this.editedItem.date = this.formatDate(val);
    }
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
      getEntries: constants.ACTION_GET_ENTRIES,
      addEntry: constants.ACTION_ADD_ENTRY,
      updateEntry: constants.ACTION_UPDATE_ENTRY,
      deleteEntry: constants.ACTION_DELETE_ENTRY,
    }),
    initialize () {
      this.getEntries();
    },
    showDate (date){
      return moment(date).format('MM/DD/YYYY')
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    editItem (item) {
      this.editedIndex = this.entries.indexOf(item)
      this.editedItem = Object.assign({}, {
        distance: item.distance,
        duration: item.duration,
        date: this.showDate(item.date),
      })
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.entries.indexOf(item)
      this.confirm_dialog = true;
      this.deletedIndex = index;
    },

    close () {
      this.dialog = false
      this.menu1 = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.$v.$reset()
      }, 300)
    },
    closeDelete () {
      this.confirm_dialog = false
      setTimeout(() => {
        this.deletedIndex = -1
      }, 300)
    },

    saveDelete(){
      if(this.deletedIndex > -1){
        console.log(this.entries[this.deletedIndex]._id)
        this.deleteEntry(this.entries[this.deletedIndex]._id)
        .then(()=>{
          this.$toast.success("Entry is deleted!",{
            timeout:900
          });
        })
        .catch(()=>{
         this.$toast.error("Entry delete failed!",{
            timeout:900
          });
        })
        this.confirm_dialog = false
        setTimeout(() => {
         this.deletedIndex = -1
        }, 300)
      }
    },

    save () {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          this.updateEntry({id:this.entries[this.editedIndex]._id, data: this.editedItem})
          .then(()=>{
            this.$toast.success("Entry updated!",{
                timeout:900
            });
          })
          .catch(()=>{
            this.$toast.error("Entry update failed",{
            timeout:900
            });
          })
          
        } else {
          this.addEntry(this.editedItem)
          .then(()=>{
            this.$toast.success("New Entry created!",{
              timeout:900
            });
          })
          .catch(()=>{
            this.$toast.error("Entry create failed",{
            timeout:900
            });
          })     
        }
        this.close()
      }
    }
  },
}
</script>