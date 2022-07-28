<template>
 <div>
 <div class="home p-grid">
  <Sidebar v-model:visible="visibleLeft">    
    <div v-if="images.length">
      <div  v-for="img in images" :key="img.id">
         <Card class="p-col-15 p-offset-0" @click="imageSeleted(img.id,img.metadata)" 
             :class="{ selected : current == img.id }">
          <template v-slot:content >
            <Image :id="img.id"/>
          </template>
         </Card><br>
      </div>
    </div>
  </Sidebar>
  <Button icon="pi pi-arrow-right" @click="visibleLeft = true" />
 </div> 
</div>
</template>

<script>
import Image from '../components/Image.vue'
import DrawShapes from '../views/DrawShapes.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Sidebar from 'primevue/sidebar'
import getImages from '../composables/getImagesAPI'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ListImages',
  components: {
    Image,
    Button,
    Card,
    Sidebar,
    DrawShapes
  },
  setup() {
    const current = ref(null)
    const image= ref(null)
    const router = useRouter()
    const visibleLeft = ref(false)
    const { images,error, load } =getImages()
    load()
    
    const imageSeleted = (id,metadata) => {
         current.value = id   
         router.push({ name: 'DrawShapes', params: { id: id , metadata : metadata}}) 
         setTimeout(() => { visibleLeft.value = false }, 1000);

    }
    return {images,error,visibleLeft,imageSeleted,image,current}
  }

}
</script>
<style scoped>
.position{
  margin-right:100px
}
img {  
max-width: 100%;  
height: auto;  
}  
.Cursor:hover{
  cursor: pointer;

}
.p-col-15:hover{
    box-shadow: 1px 2px 3px rgba(50, 156, 38, 0.589);
    transform: scale(1.02);
    transition: all ease 0.2s;
    cursor: pointer;
}
.selected{
  background-color:rgba(50, 156, 38, 0.589);
}

</style>
