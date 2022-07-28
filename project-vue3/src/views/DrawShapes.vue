<template>
    <div>
        <h3 class="Cursor">Draw Shape :</h3>&emsp;
        <img class="Cursor" src="@/assets/images/rectangle.jpg" 
        @click="createShape(4)"
        width="20" height="20" >&emsp;
        <img class="Cursor" src="@/assets/images/polygon.jpg" 
        @click="createShape(10)"
        width="20" height="20">&emsp;
        <img class="Cursor" src="@/assets/images/triangle.jpg" 
        @click="createShape(3)"
        width="20" height="20">&emsp;
        <img class="Cursor" src="@/assets/images/circle.jpg" 
        @click="createShape(50)"
        width="20" height="20" >&emsp;

        <div class="container">
        <!-- <Metadata :metadata="metadata"></Metadata> -->
        </div>

        <div class="change">
        <DrawImage :shapes="filteredShapes" :id="id" :show="showShapes" 
        :shapesVertex="filteredShapesVertex" :colorVertex="colorVertex"/>
        </div>
        <div class="listPosition">
        <Listbox v-model="selectedLabel" :options="Labels" optionLabel="name" 
        style="width:10.5rem" listStyle="max-height:185px">
        </Listbox>
        <h5>Pick a Color : </h5>
        <ColorPicker v-model="color1" :inline="true" /><br><br>
        
        <Button label="Primary" class="p-button-raised p-button-rounded">    
        <i :class="{'pi':true, 'pi-eye-slash':(showShapes==false),'pi-eye':(showShapes==true)}" 
        @click="displayShapes">&nbsp;<b>{{title}}</b></i>       
        </Button><hr>
        <Button label="Primary" class="p-button-raised p-button-rounded">    
        <i class="pi pi-refresh" 
         @click="reset">&nbsp;<b>Reset</b></i>  
        </Button>
        </div>
    </div>
</template>
<script>
import Listbox from 'primevue/listbox';
import ColorPicker from 'primevue/colorpicker';
import { ref } from 'vue'
import {watch} from 'vue'
import Button from 'primevue/button'
import DrawImage from './DrawImage.vue'
import { onMounted,computed} from 'vue'
import getShapes from '@/composables/getShapes'  
import getShapesVertex from '@/composables/getShapesVertex'  
import Metadata from '@/components/Metadata.vue'



export default {
    props: ['id','metadata'],
    components: {
        Listbox,
        ColorPicker ,
        DrawImage,
        Button,
        Metadata
    },
    setup(props) {
        
        const color1 = ref('1976D2');
        const RGBred = ref('100');
        const RGBgreen = ref('150');
        const RGBblue = ref('200');
        const color1Decimal = ref(null);
        const selectedLabel = ref({name:"Text"});
        const colorVertex = ref([100,150,200,selectedLabel.value.name])
        const showShapes=ref(true)
        const title = ref('Hide Shapes')
        const { shapes, error, load } =getShapes()
        const { shapesVertex, errorVertex, loadVertex  } =getShapesVertex()
        load()
        loadVertex()
        onMounted(()=> {
            window.addEventListener("keypress", e => {
             if(String.fromCharCode(e.keyCode)==='r' || String.fromCharCode(e.keyCode)==='R'){
                 createShape(4)
             }else if(String.fromCharCode(e.keyCode)==='p' || String.fromCharCode(e.keyCode)==='P'){
                 createShape(10)
             }else if(String.fromCharCode(e.keyCode)==='c' || String.fromCharCode(e.keyCode)==='C'){
                 createShape(50)
             }else if(String.fromCharCode(e.keyCode)==='t' || String.fromCharCode(e.keyCode)==='T'){
                 createShape(3)
             }else{
                 return false;
             }
            });
        })


        document.addEventListener("delete", (e) => {
            shapes.value = shapes.value.filter(shape => {
                return shape.id != e.detail.id
            })
        })
        document.addEventListener("deleteShapeVertex", (e) => {
            shapesVertex.value = shapesVertex.value.filter(shape => {
                return shape.id != e.detail.id
            })
        })
        const displayShapes = () =>{
             showShapes.value=!showShapes.value
             if(showShapes.value == true){
                 title.value="Hide Shapes"
             }else{
                 title.value="Show Shapes"
             }
        }
        const reset = () =>{
            const resetEvent=new CustomEvent("reset")
            document.dispatchEvent(resetEvent)
        }
        const Labels = ref([
            {name: 'Trees'},
            {name: 'Mountain'},
            {name: 'Car'},
            {name: 'Window'},
            {name: 'Light'},
            {name: 'Sign'},
            {name: 'Roof'},
            {name: 'Wall'},
            {name: 'Door'},
            {name: 'Person'},
            {name: 'Water'},
        ]);

        watch(color1,()=>{
         color1Decimal.value = parseInt(color1.value, 16)
         RGBred.value = Math.floor(color1Decimal.value / (256*256));
         RGBgreen.value = Math.floor(color1Decimal.value / 256) % 256;
         RGBblue.value = color1Decimal.value % 256;
         colorVertex.value = [RGBred.value,RGBgreen.value,RGBblue.value,selectedLabel.value.name]
        })

        const filteredShapes = computed(() => {
           return  shapes.value.filter((shape) => shape.idImage == props.id)
        })
        const filteredShapesVertex = computed(() => {
           return  shapesVertex.value.filter((shape) => shape.idImage == props.id)
        })
        const createShape = async (npoints) =>{
         let id
         let shape =
          {     
                idImage:props.id,
                name: selectedLabel.value.name, 
                npoints: npoints, 
                radius: 60, 
                x: 250, 
                y: 250,
                red:RGBred.value, 
                green:RGBgreen.value,
                blue: RGBblue.value,
          }
         await fetch('http://localhost:3000/shapes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shape) //params
          }).then(async(data) => {
             let res = await data.json()
             //console.log(res)
             id=res.id
          }).catch(err => console.log(err))
          shapes.value.push({...shape,id:id})
        }

      return { createShape,Labels,showShapes,title,reset,shapesVertex,colorVertex,
             color1,selectedLabel,filteredShapes,displayShapes,filteredShapesVertex}  
    },
}
</script>

<style scoped>
.Cursor{
  cursor: pointer;
}
h3{
    display: inline-block;
    margin-top: 30px;
    position: relative;
    font-size: 20px;
    color: black;
    margin-bottom: 10px;
 }
h3::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: #0c9222;
    position: absolute;
    z-index: -1;
    padding-right: 40px;
    left: -30px;
    transform: rotateZ(-1.5deg);
}
.listPosition {
  position: absolute;
  top: 60px;
  left: 30px;
  height: 193px;
  width:195px;
  border: 3px solid #73AD21;
}
.change{
  position: absolute;
  top: 120px;
  margin-left:250px;
}
.pi{
    cursor: pointer;
}
.container{
    position:relative; 
    left: 600px; 
    top: 50px;
}
</style>