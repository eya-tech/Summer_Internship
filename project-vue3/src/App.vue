<template>
  <div >
     <nav >
       <ListImages />
     </nav>
    <router-view/>
  </div>
</template>
<script>

import ListImages from './views/ListImages.vue'

export default ({
 name: 'App',
 components:{
   ListImages,
 }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
