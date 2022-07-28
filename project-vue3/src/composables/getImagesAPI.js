import { ref } from 'vue'

const getImages = () => {

  const images = ref([])
  const error = ref(null)

  const load =  () => {
     fetch('http://localhost:3000/imagesAPI')
            .then(response => response.json())
            .then(data=>{
               images.value=data
              //  console.log(data)
              //  console.log(images.value)
            }).catch(error=>error.value=error)
  }

  return { images, error, load }
}

export default getImages