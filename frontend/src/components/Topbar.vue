<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />
    </div>
    <v-toolbar-title>Jogging Track</v-toolbar-title>
    
    <div class="ml-10">
      <v-btn
        to="/users"
        text
        v-if="currentUser.role!='user'"
      >
        <span class="mr-2">Users</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-menu offset-y 
        v-if="currentUser.role!='manager'">
        <template v-slot:activator="{on}">
          <v-btn text slot="activator" v-on="on">
            <span>Entries</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
          v-for="link in links"
          :key="link.text"
          :to="link.route"
          >
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </div>
    <v-spacer></v-spacer>
      <v-menu offset-y >
        <template v-slot:activator="{on}">
            <v-avatar slot="activator" v-on="on">
              <img
                :src="currentUser.profileImg"
                alt="John"
              >
            </v-avatar>
            <v-card-title>{{currentUser.name}}</v-card-title>
        </template>
        <v-list>
          <v-list-item
          v-for="link in account"
          :key="link.text"
          :to="link.route"
          >
            <v-list-item-title>
              {{ link.text }}
              <v-icon>{{link.icon}}</v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  </v-app-bar>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name:'Topbar',
  computed: {
    ...mapGetters([
      'currentUser',
    ]),
  },
  data(){
    return {
      links:[
        { text:'Entries', route:'/entries' },
        { text:'Weekly Report', route:'/report' },
      ],
      account:[
        { text:'Settings', route:'/settings', icon:'mdi-cog-outline' },
        { text:'Log out', route:'/logout', icon:'mdi-logout'},
      ]
    }
  }
}
</script>