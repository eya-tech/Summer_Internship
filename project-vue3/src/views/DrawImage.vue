<template>
  <div>
      <div id="vue-canvas"></div> 
  </div>
</template>

<script>
import {watch} from 'vue'
import { ref } from 'vue'
import DrawShape from "@/composables/DrawShapes"
import { vertex } from "@/composables/vertex"
import P5 from "p5" 
import { onMounted ,onUpdated} from "vue"

export default {
 props:['shapes','id','show','shapesVertex','colorVertex'],
 components: {

 },
 setup(props){
     const shapesDB = ref([])
     const verticesDB = ref([])
     const verticesX = ref([])
     const vertexToDrag = ref(null)
     const selectedShape = ref(null)
     const addingShape = ref(false)
     const dragging = ref(false)
     const isdragging = ref(false)
     
      const shapesDraw = ref([])
      const image = ref(null)
      const p5canvas = ref(null)
      const scale = ref(1)
      const drag = ref(true)
      const img=ref(null)

      const w=ref(null)
      const h=ref(null)
      const x = ref(null)
      const y = ref(null)
      const zoom = ref(.001) 
      const e = ref(0) 

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
      document.addEventListener("reset", () => {
             w.value  = img.value.width;
             h.value = img.value.height;
             x.value = img.value.width/2;
             y.value = img.value.height/2;
             scale.value = 1
      })
      document.addEventListener("pressed", () => {
           drag.value = false
      })
      document.addEventListener("released", () => {
           drag.value = true
      })
      document.addEventListener("dragAll", () => {
            drag.value=false
      })
      document.addEventListener("drag", () => {
              drag.value=false
      })
      document.addEventListener("mouseup",() =>{
        if(addingShape.value && isdragging.value){
            addingShape.value = false
        }
        else if(!isdragging.value && verticesDB.value.length > 0){
            addingShape.value = true
        }
      })

      const pointInPoly = (verts, pt) => {
       let c = false
       for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
         if (
           verts[i].y - ( h.value/2 - y.value) > pt.y != verts[j].y - ( h.value/2 - y.value) > pt.y &&
           pt.x <
             ((verts[j].x - verts[i].x) * (pt.y - verts[i].y + ( h.value/2 - y.value))) /
               (verts[j].y - verts[i].y) +
               verts[i].x - ( w.value/2 - x.value)
         )
           c = !c
       }
       return c
      }

      onMounted( async() => {
         await load()
         p5canvas.value = new P5(setupImage,"vue-canvas")
      }) 
        
      watch(image, () => {
         shapesDraw.value = []
         shapesDB.value = []
         drawImage(p5canvas.value)
      })  

      onUpdated( async () => {
         await load()
      }) 

      const setupImage = (p5) => {
        p5.setup = () => {
         const canvas = p5.createCanvas(1200, 700)
         canvas.parent("vue-canvas")
        }
      }

      const drawImage = (p5) => { 

          img.value=p5.loadImage(image.value,()=>{
             w.value  = img.value.width;
             h.value = img.value.height;
             x.value = img.value.width/2;
             y.value = img.value.height/2;
             scale.value = 1
          })

           for (var i = 0; i < props.shapes.length; i ++) {
                shapesDraw.value.push(new DrawShape(props.shapes[i].x, props.shapes[i].y, 
                props.shapes[i].radius, props.shapes[i].npoints,props.shapes[i].name,
                props.shapes[i].red,props.shapes[i].green,
                props.shapes[i].blue))
            }
            for (var shape of props.shapesVertex) {
             shapesDB.value.push({
              id: shape.id,
              color: shape.color,
              vertices:shape.vertices.map((v) => new vertex(v.x, v.y,v.r,v.col))
             })
            }
            console.log(shapesDB.value)

        p5.draw = () => {
          p5.background(255)
          p5.image(img.value,x.value-w.value/2, y.value-h.value/2, w.value, h.value,
                              0, 0,img.value.width,img.value.height)
          if(props.show){
             for (var i = 0; i < shapesDraw.value.length; i ++) {
                  shapesDraw.value[i].over(p5.mouseX,p5.mouseY,(w.value/2 - x.value)
                                                                ,(h.value/2 - y.value),scale.value);
                  shapesDraw.value[i].update(p5.mouseX,p5.mouseY);
                  shapesDraw.value[i].show(p5,( w.value/2 - x.value),( h.value/2 - y.value),
                                            scale.value,shapesDraw.value[i].red,shapesDraw.value[i].green,
                                            shapesDraw.value[i].blue);
             }
          //vertex
        
         for (var shape of shapesDB.value) {
          let color = p5.color(shape.color[0], shape.color[1], shape.color[2])
          p5.stroke(color)
          let inside = pointInPoly(
            shape.vertices,
            p5.createVector(p5.mouseX, p5.mouseY)
          )
          if (selectedShape.value === shape.id) {
            p5.push()
            p5.translate(-( w.value/2 - x.value),-( h.value/2 - y.value))
            p5.scale(scale.value)
            shape.vertices.forEach((h) => {
              p5.stroke(h.col)
              p5.strokeWeight(2 / scale.value)
              p5.noFill()
              p5.ellipse(h.x, h.y, h.r * 2 / scale.value)
            })
            p5.pop()
          }

          if (
            (inside &&
              selectedShape.value !== shape.id &&
              !dragging.value &&
              !addingShape.value) ||
              selectedShape.value === shape.id
          ) {
            p5.fill(
              p5.color(shape.color[0], shape.color[1], shape.color[2], 90)
            )
          } else {
            p5.fill(
              p5.color(shape.color[0], shape.color[1], shape.color[2], 120)
            )
          }
          p5.push()
          p5.beginShape()
          p5.translate(-( w.value/2 - x.value),-( h.value/2 - y.value));
          p5.scale(scale.value)
          shape.vertices.forEach((h) => p5.vertex(h.x, h.y))
          p5.endShape(p5.CLOSE)
          p5.pop()

         }
         let color = props.colorVertex
         p5.stroke(color[0], color[1], color[2], 255)
         p5.fill(color[0], color[1], color[2], 120)
         

         p5.push()
         p5.beginShape()
         p5.translate(-( w.value/2 - x.value),-( h.value/2 - y.value));
         p5.scale(scale.value)
         verticesDB.value.forEach((h) => p5.vertex(h.x, h.y))
         p5.endShape(p5.CLOSE)
         p5.pop()


         p5.push()
         p5.translate(-( w.value/2 - x.value),-( h.value/2 - y.value))
         p5.scale(scale.value)
         for (let vertex of verticesDB.value) {
              p5.stroke(vertex.col)
              p5.strokeWeight(2 / scale.value)
              p5.noFill()
              p5.ellipse(vertex.x, vertex.y, vertex.r * 2 / scale.value)
         }
         p5.pop()

        // Show small circle near the cursor when adding shapes
         if (addingShape.value || verticesDB.value.length > 0) {
          p5.fill(255)
          p5.circle(p5.mouseX, p5.mouseY, 10, 10)
         }
        }
        }

        p5.mousePressed= (event) => {
          if(event.path[0].className == "p5Canvas"){
            
             for (var i = 0; i < shapesDraw.value.length; i ++) {
                  shapesDraw.value[i].pressed(p5.mouseX,p5.mouseY
                                ,( w.value/2 - x.value),( h.value/2 - y.value),scale.value);
             }
            //vertex
           if (!addingShape.value) {
          // On a point ?
           for (var shape of shapesDB.value) {
            for (const [i, vertex] of shape.vertices.entries()) {
              let pointSelect = vertex.checkPoint(p5,( w.value/2 - x.value),( h.value/2 - y.value))
              if (pointSelect) {
                vertexToDrag.value = i 
                selectedShape.value = shape.id
                dragging.value = true
                return
              }
            }
           }
          // In a polygon
           for (var shape of shapesDB.value) {
            let inside = pointInPoly(
              shape.vertices,
              p5.createVector(p5.mouseX, p5.mouseY)
            )
            if (inside) {
              selectedShape.value = shape.id
              dragging.value = true
              return
            }
           }
          }
          }
        }

        p5.mouseReleased= (event) => {
           if(event.path[0].className == "p5Canvas"){
             isdragging.value = false
             drag.value = true
             p5.cursor(p5.ARROW)
             for (var i = 0; i < shapesDraw.value.length; i ++) {
                  shapesDraw.value[i].released(props.shapes[i].id);
             }
             //vertex
              if (vertexToDrag.value !== null) {
                 vertexToDrag.value = null
              } else {
               dragging.value = false
               selectedShape.value = null
              }
               for (var shape of shapesDB.value) {
                 shape.vertices.forEach((h) => h.released(shape.id))
               }
           }
        }

        p5.doubleClicked = (event) => {
          if(event.path[0].className == "p5Canvas"){
             w.value  = img.value.width;
             h.value = img.value.height;
             x.value = img.value.width/2;
             y.value = img.value.height/2;
             scale.value = 1
          }
        }

        p5.keyTyped = () => {
          for (var i = 0; i < shapesDraw.value.length; i ++) {
                  shapesDraw.value[i].keyTyped(p5,props.shapes[i].id);
          }
        }

        p5.mouseClicked = (event) => {
          if(event.path[0].className == "p5Canvas"){
            for (var i = 0; i < shapesDraw.value.length; i ++) {
                  shapesDraw.value[i].clicked();
            }
            //vertex
            if (addingShape.value) {
            // If adding shape, add a new vertex to the current shape
            let b = new vertex(
              p5.mouseX  + ( w.value/2 - x.value),
              p5.mouseY + ( h.value/2 - y.value),
              8,
              p5.color(props.colorVertex[0], props.colorVertex[1], props.colorVertex[2])
            )
            verticesDB.value.push(b)
            verticesX.value.push({
                           "x":p5.mouseX  + ( w.value/2 - x.value),
                           "y":p5.mouseY + ( h.value/2 - y.value),
                           "r":8,
                           "col":[props.colorVertex[0], props.colorVertex[1], props.colorVertex[2]],
                          })
          }else {
            // If the cursor is inside a shape, select it (if not currently dragging)
            for (var shape of shapesDB.value) {
              let inside = pointInPoly(
                shape.vertices,
                p5.createVector(p5.mouseX, p5.mouseY)
              )
              if (inside && !dragging.value) {
                selectedShape.value = shape.id
                console.log(selectedShape.value)
              }
            }
           }
          }
        }

        p5.keyPressed = async () => {
          for (var i = 0; i < shapesDraw.value.length; i ++) {
                  shapesDraw.value[i].keyPressed(p5,props.shapes[i].id)
          }
          // vertex
          if (p5.key === "n") {
           addingShape.value = true
          } else if (p5.key == "Enter") {
           if (addingShape.value) {
             if (verticesDB.value.length) {
               let id
               let shape={
                 vertices: verticesX.value,
                 color: [props.colorVertex[0], props.colorVertex[1], props.colorVertex[2]],
                 idImage: props.id,
                 name: props.colorVertex[3],
               }
               let forme={
                 vertices: verticesDB.value,
                 color: [props.colorVertex[0], props.colorVertex[1], props.colorVertex[2]]
               }
              await fetch('http://localhost:3000/shapesVertex', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(shape) //params
              }).then(async(data) => {
               let res = await data.json()
               id = res.id
               console.log(id)

              }).catch(err => console.log(err))

              shapesDB.value.push({...forme,id:id})
              verticesDB.value = []
              verticesX.value = []
              addingShape.value = false
            }
           }
           return false // To prevent default behavior
          } else if (p5.key === "Delete") {
           if (selectedShape.value) {
             fetch(`http://localhost:3000/shapesVertex/${selectedShape.value}`, {
             method: 'DELETE',
             }).then(() => {
             console.log(" deleted : " + selectedShape.value)
             const deleteEvent=new CustomEvent("deleteShapeVertex",{
               detail:{
                 id:selectedShape.value
               }
             })
             document.dispatchEvent(deleteEvent)
             }).catch(err => console.log(err))
             shapesDB.value = shapesDB.value.filter(
               (shape) => shape.id !== selectedShape.value
             )
            return false // To prevent default behavior
          }
          } else if ((p5.key === "Escape")) {
           if (addingShape.value || verticesDB.value.length > 0) {
            verticesDB.value = []
            verticesX.value = []
            addingShape.value = false
           }
          }
        }

        p5.mouseDragged = (event) => {
          if(event.path[0].className == "p5Canvas" ){
            if(drag.value){
             isdragging.value = true
             p5.cursor('grab')
             x.value += p5.mouseX - p5.pmouseX
             y.value += p5.mouseY - p5.pmouseY
            }
            //vertex
           if (vertexToDrag.value !== null) {
            if (selectedShape.value !== null) {
             let shapeDB = shapesDB.value.find(
               (shape) => shape.id === selectedShape.value
             )
             shapeDB.vertices[vertexToDrag.value].drag(p5,( w.value/2 - x.value),( h.value/2 - y.value))

            } else {
             verticesDB.value[vertexToDrag.value].drag(p5,( w.value/2 - x.value),( h.value/2 - y.value))
            }
           }
           if (
           selectedShape.value !== null &&
           vertexToDrag.value === null &&
           dragging.value
           ) {
           // Drag shape
           let shapeDB = shapesDB.value.find(
            (shape) => shape.id === selectedShape.value
           )
           for (const [i, vertex] of shapeDB.vertices.entries()) {
             vertex.dragAll(p5)
           }
          }
          }
        }

        p5.mouseWheel = (event) => {
          e.value = -event.delta;
          if(event.path[0].className == "p5Canvas"){
           if (e.value>0) { //zoom in
            p5.cursor('zoom-in')
            for (var i=0; i<e.value; i++) {
              if (w.value>50*img.value.width) return; //max zoom
              x.value -= zoom.value * (p5.mouseX - x.value)
              y.value -= zoom.value * (p5.mouseY - y.value)
              w.value *= zoom.value + 1
              h.value *= zoom.value + 1
              scale.value *= zoom.value + 1
            }
           }
          if (e.value<0) { //zoom out
             p5.cursor('zoom-out')
             for (var i=0; i<-e.value; i++) {
               if (w.value<img.value.width) return;
               x.value += zoom.value/(zoom.value+1) * (p5.mouseX - x.value) 
               y.value += zoom.value/(zoom.value+1) * (p5.mouseY - y.value)
               h.value /= zoom.value + 1
               w.value /= zoom.value + 1
               scale.value /= zoom.value + 1
             }
          }
         }
        }

      }
 }
}
</script>

<style>

</style>