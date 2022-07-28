export default class DrawShape {
    constructor(x,y,r,n,t,red,green,blue) {
  
      this.dragging = false;
      this.rollover = false; 
      this.click = false;
      this.resized=false;
  
      //position
      this.x=x
      this.y=y
      // radius and npoints
      this.r=r
      this.n=n
      //annotate
      this.text=t
      //Color RGB
      this.red=red
      this.green=green
      this.blue=blue

    }

    get radius() {
      return this.r;
    }
    set radius(newR) {
      this.r = newR;
    }
    get points() {
      return this.n;
    } 
    set points(newN) {
      this.n = newN;
    }
  

    over(mouseX,mouseY,tox,toy,scale) {

      if (mouseX > this.x - scale*this.r - tox  && mouseX < this.x + scale*this.r - tox
        && mouseY > this.y - scale*this.r - toy && mouseY < this.y + scale*this.r - toy ) {
        this.rollover = true;
      } 
      else {
        this.rollover = false;
        this.click= false;
      }
    }
  
    update(mouseX,mouseY) {

      if (this.dragging) {
        this.x = mouseX + this.offsetX;
        this.y = mouseY + this.offsetY;
      }
  
    }
  
    show(p5,tox,toy,scale,r,g,b) {
      p5.stroke(0);
      if (this.dragging) {
        p5.fill(r,g,b,90);
      } 
      else if (this.rollover) {
        p5.fill(r,g,b,90);
      } 
      else if (this.click){
        p5.fill(r, g,b,90);
      }
      else {
        p5.fill(r, g,b,120);
      }
      p5.push()
      p5.translate(- tox,- toy)
      p5.scale(scale)    
      this.polygon(p5,this.x, this.y, this.r, this.n)
      p5.pop()
    }

    clicked(){
      if(this.rollover == true)
      {
       this.click=true
      }
    }

    polygon(p5,x, y, radius, npoints) {

      let angle = p5.TWO_PI / npoints;
      p5.beginShape();
      if(npoints == 4){
        for(let a=p5.HALF_PI/2; a < p5.TWO_PI; a += angle){
          let sx = x + p5.cos(a) * radius
          let sy = y + p5.sin(a) * radius
          p5.stroke(this.red,this.green,this.blue)
          p5.vertex(sx, sy);
        }
      }else if(npoints == 3){
        for(let a=p5.HALF_PI/3; a < p5.TWO_PI; a += angle){
          let sx = x + p5.cos(a) * radius
          let sy = y + p5.sin(a) * radius
          p5.stroke(this.red,this.green,this.blue)
          p5.vertex(sx, sy)
        }
      }else{
      for (let a = 0; a < p5.TWO_PI; a += angle) {
        let sx = x + p5.cos(a) * radius
        let sy = y + p5.sin(a) * radius
        p5.stroke(this.red,this.green,this.blue)
        p5.vertex(sx, sy);
      }
      }
      p5.strokeWeight(1);
      // p5.textSize(20);
      // //sp5.textStyle(p5.BOLD);
      // p5.text(this.text, x, y);
      p5.endShape(p5.CLOSE);
    }

    pressed(mouseX,mouseY,tox,toy,scale) {

      if (mouseX > this.x - scale*this.r - tox  && mouseX < this.x + scale*this.r - tox 
        && mouseY > this.y - scale*this.r - toy && mouseY < this.y + scale*this.r - toy) {
        this.dragging = true
        const pressedEvent=new CustomEvent("pressed")
        document.dispatchEvent(pressedEvent)
        this.offsetX = this.x - mouseX
        this.offsetY = this.y - mouseY
      }
    }

    keyTyped(p5,id) {

      if(this.rollover == true && this.click == true) {
        if (p5.key === '+'){
         this.r = this.r +10
       }else if (p5.key === '-'){
         this.r = this.r -10
       }else {
         return false
       }
       fetch(`http://localhost:3000/shapes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ radius: this.r})
        }).then(() => {
          console.log("updated : ",id)
        }).catch(err => console.log(err))
      }
    }

    keyPressed(p5,id) {

      if( this.click  && this.rollover) {
        if (p5.keyCode === p5.DELETE) {
          fetch(`http://localhost:3000/shapes/${id}`, {
            method: 'DELETE',
          }).then(() => {
            const deleteEvent=new CustomEvent("delete",{
              detail:{
                id:id
              }
            })
            document.dispatchEvent(deleteEvent)
            console.log(" deleted : " + id)
          }).catch(err => console.log(err))
        }else{
          return false
        }
      }else{
        return false
      }
  
    }
  
    released(id) {
      // Quit dragging
      this.dragging = false;
      if(this.rollover == true) {
      fetch(`http://localhost:3000/shapes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
                             x: this.x ,
                             y: this.y
                             })
      }).then(() => {
        const releasedEvent=new CustomEvent("released")
        document.dispatchEvent(releasedEvent)
      }).catch(err => console.log(err))
      }
    }

  }