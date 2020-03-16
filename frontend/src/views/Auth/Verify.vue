<template>
  <p>Verify page</p>
</template>
<script>
import AuthService from '@/services/AuthService'
export default {
  name: 'VerifyPage',
  props: {
    'token': {
      type: String,
      required: true,
    }
  },
  mounted() {
    if(this.token){
      AuthService.verify({token:this.token})
      .then(()=>{
        this.$toast.success("Email is verified!",{
          timeout:900
        });
      })
      .catch((err)=>{       
        this.$toast.warning(err.response.data.message,{
          timeout:900
        });
      })
    }
    else{
      this.$toast.error("Token is empty!",{
        timeout:900
      });
    }
    this.$router.push({
      name: 'login'
    })
  },
}
</script>