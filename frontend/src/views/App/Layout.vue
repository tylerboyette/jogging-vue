<template>
  <div>
    <Topbar/>
    <router-view/>
  </div>
</template>
<script>
import Topbar from '@/components/Topbar'
export default {
  name: 'Layout',
  components:{
    Topbar
  }
}
</script>