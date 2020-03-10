<template>
  <v-app>
    <!-- <Topbar /> -->
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
// import Topbar from './components/Topbar'

export default {
  name: 'App',

  components: {
    // Topbar
  },

  data: () => ({
  })
}
</script>
