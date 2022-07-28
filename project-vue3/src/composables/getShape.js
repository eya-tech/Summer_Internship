import { ref } from 'vue'

const getShape = (id) => {

  const shape = ref(null)
  const error = ref(null)

  const load =  () => {
        fetch('http://localhost:3000/shapes/'+id)
            .then(response => response.json())
            .then(data=>{
               shape.value=data
        }).catch(error=>error.value=error)
  }

  return { shape, error, load } 
}

export default getShape