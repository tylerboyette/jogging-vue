<template>
  <v-container style="min-height:100%; padding:5%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="10">
        <v-data-table
          :headers="headers"
          :items="users"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>User List</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">New User</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                           <v-select
                            v-model="editedItem.role"
                            :items="roles"
                            label="Role"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                          v-model="editedItem.password"
                          :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show_password ? 'text' : 'password'"
                          name="input-10-1"
                          label="Password"
                          @click:append="show_password = !show_password"
                          ></v-text-field>
                        </v-col>
                      </v-row>
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
          <template v-slot:item.action="{ item }">
            <v-icon
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
        <v-dialog
            v-model="confirm_dialog"
            width="500"
          >
            <v-card>
              <v-card-title
                class="headline"
              >
                Are you sure you want to delete this user?
              </v-card-title>

              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="saveDelete">Save</v-btn>
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
export default {
  data: () => ({
    dialog: false,
    confirm_dialog:false,
    roles:['user','manager'],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Email', value: 'email' },
      { text: 'Role', value: 'role' },
      { text: 'Action', value: 'action', sortable: false },
    ],
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      name: '',
      email: '',
      password:'',
      role:'user'
    },
    defaultItem: {
      name: '',
      email: '',
      role:'user'
    },
  }),

  computed: {
    ...mapGetters([
      'currentUser',
      'users'
    ]),
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    if (this.currentUser.role=='user'){
      this.$router.push({
        name: 'dashboard'
      })
    }
    else
      this.initialize()
  },

  methods: {
    ...mapActions({
      getUsers: constants.ACTION_GET_USERS,
      addUser: constants.ACTION_ADD_USER,
      updateUser: constants.ACTION_UPDATE_USER,
      deleteUser: constants.ACTION_DELETE_USER,
    }),
    initialize () {
      this.getUsers();
      this.show_password = false;
    },

    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      this.confirm_dialog = true;
      this.deletedIndex = index;
      // confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
    },

    close () {
      this.dialog = false
      this.show_password = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
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
        this.deleteUser(this.users[this.deletedIndex]._id)
        .then(()=>{
          this.users.splice(this.deletedIndex, 1)
          this.$toast.success("User is deleted!",{
            timeout:900
          });
        })
        .catch(()=>{
         this.$toast.error("User delete failed!",{
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
      if (this.editedIndex > -1) {
         this.updateUser({id:this.users[this.editedIndex]._id, data: this.editedItem})
        .then(()=>{
          Object.assign(this.users[this.editedIndex], this.editedItem)
          this.$toast.success("User updated!",{
              timeout:900
          });
        })
        .catch(()=>{
          this.$toast.error("Email is already taken!",{
           timeout:900
          });
        })
        
      } else {
        this.addUser(this.editedItem)
        .then(()=>{
          this.users.push(this.editedItem)
          this.getUsers();
          console.log('success')
          this.$toast.success("New User created!",{
            timeout:900
          });
        })
        .catch(()=>{
          this.$toast.error("Email is already taken!",{
           timeout:900
          });
        })
        
      }
      this.close()
    },
  },
}
</script>