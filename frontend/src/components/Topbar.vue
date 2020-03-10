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
    <v-spacer></v-spacer>
    <v-btn
      to="/users"
      text
    >
      <span class="mr-2">Users</span>
      <v-icon>mdi-user</v-icon>
    </v-btn>
    <v-btn
      to="/logout"
      text
    >
      <span class="mr-2">Log Out</span>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>
