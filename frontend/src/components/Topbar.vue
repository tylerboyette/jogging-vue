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
      <v-btn
        to="/entries"
        text
        v-if="currentUser.role!='manager'"
      >
        <span class="mr-2">Entries</span>
      </v-btn>
    </div>
    <v-spacer></v-spacer>

    <v-btn
      to="/logout"
      text
    >
      <span class="mr-2">Log Out</span>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
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
  }
}
</script>