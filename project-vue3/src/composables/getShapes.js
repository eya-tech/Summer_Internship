import { ref } from 'vue'

const getShapes = () => {

  const shapes = ref([])
  const error = ref(null)
  const errorVertex = ref(null)

  const load =  () => {
     fetch('http://localhost:3000/shapes')
            .then(response => response.json())
            .then(data=>{
               shapes.value=data
               //console.log(shapes.value)
            }).catch(error=>error.value=error)
  }
//   const loadVertex = () => {
//    fetch('http://localhost:3000/shapesVertex')
//    .then(response => response.json())
//    .then(data=>{
//       shapesVertex.value=data
//       console.log(shapesVertex.value)
//    }).catch(error=>errorVertex.value=error)
//   }

  return { shapes, error, load }
}

export default getShapes