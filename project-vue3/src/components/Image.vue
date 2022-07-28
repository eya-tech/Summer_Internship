<template>
     <div>
       <img :src="image">
     </div>
</template>

<script>
import {ref, onMounted} from "vue"

export default {
  props: ['id'],
  setup(props){
      const image = ref(null)
      const load = () => {
           var params = { 
             id: props.id
           }
           var url = new URL("http://34.152.13.130:29979/image")
           url.search = new URLSearchParams(params).toString()
           fetch(url)
            .then(response =>{ 
              if(response.ok){
              response.blob()
              .then(data=>{
               image.value = URL.createObjectURL(data)
              })
              }else{
                console.log('Wrong response from network');
              }
            }).catch(error=>console.log(error))
      }
      onMounted( () => {
           load()
      })


      return { image }
  }

}
</script>

<style scoped>
img{
  border-radius: 2px;
  width:100%;
  height:100%
}
</style>