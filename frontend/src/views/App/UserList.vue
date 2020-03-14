<template>
  <v-container style="min-height:100%; padding:5%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="10">
      <v-progress-circular v-if="userLoading"
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
        <v-data-table
          v-if="!userLoading"
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
                  <v-btn color="primary" dark class="mb-2" v-on="on">
                    <v-icon left>mdi-account-plus</v-icon>
                    New User
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
                            <v-text-field 
                              v-model="editedItem.name" 
                              label="Name"
                              :error-messages="nameErrors"
                              required
                              @input="$v.editedItem.name.$touch()"
                              @blur="$v.editedItem.name.$touch()"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field 
                              v-model="editedItem.email" 
                              label="Email"
                              :error-messages="emailErrors"
                              required
                              @input="$v.editedItem.email.$touch()"
                              @blur="$v.editedItem.email.$touch()"
                            ></v-text-field>
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
                            :error-messages="passwordErrors"
                            name="password"
                            label="Password"
                            @input="$v.editedItem.password.$touch()"
                            @blur="$v.editedItem.password.$touch()"
                            @click:append="show_password = !show_password"
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
            <p class='headline'>There's no users!</p>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
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
                <v-btn color="blue darken-1" text @click="saveDelete">Yes</v-btn>
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
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'UserList',
  mixins: [validationMixin],
  validations: {
    editedItem:{
      name: {
        required,
        minLength: minLength(3)
      },
      email: { required, email },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  data: () => ({
    dialog: false,
    confirm_dialog:false,
    roles:['user','manager'],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
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
      password:'',
      role:'user'
    },
  }),

  computed: {
    ...mapGetters([
      'currentUser',
      'users',
      'userLoading'
    ]),
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
    nameErrors () {
      const errors = []
      if (!this.$v.editedItem.name.$dirty) return errors
      !this.$v.editedItem.name.minLength && errors.push('Name must be at most 3 characters long')
      !this.$v.editedItem.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.editedItem.email.$dirty) return errors
      !this.$v.editedItem.email.email && errors.push('Must be valid e-mail')
      !this.$v.editedItem.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.editedItem.password.$dirty) return errors
      !this.$v.editedItem.password.minLength && errors.push('Password must be at most 3 characters long')
      !this.$v.editedItem.password.required && errors.push('Password is required')
      return errors
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
      this.editedItem = Object.assign({}, {
        name: item.name,
        email: item.email,
        role: item.role,
      })
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      this.confirm_dialog = true;
      this.deletedIndex = index;
    },

    close () {
      this.dialog = false
      this.show_password = false;
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
        this.deleteUser(this.users[this.deletedIndex]._id)
        .then(()=>{
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
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          this.updateUser({id:this.users[this.editedIndex]._id, data: this.editedItem})
          .then(()=>{
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
      }
    }
  },
}
</script>