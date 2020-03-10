<template>
  <div>
    Logging out...
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import * as constants from '@/store/constants'

export default {
  name: 'Logout',
  beforeMount() {
    localStorage.removeItem('token')
    this.$router.push({
      name: 'login'
    })
    this.setCurrentUser(null);
    this.$toast.success("Log out successfully!",{
      timeout:900
    });
  },
  methods:{
    ...mapActions({
     setCurrentUser: constants.ACTION_SET_CURRENT_USER,
    }),
  }
}
</script>