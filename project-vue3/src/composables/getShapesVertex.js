import { ref } from 'vue'

const getShapesVertex = () => {

  const shapesVertex = ref([])
  const errorVertex = ref(null)

  const loadVertex = async () => {
   await fetch('http://localhost:3000/shapesVertex')
   .then(response => response.json())
   .then(data=>{
      shapesVertex.value=data
      //console.log(shapesVertex.value)
   }).catch(error=>errorVertex.value=error)
  }

  return { shapesVertex, errorVertex, loadVertex }
}

export default getShapesVertex