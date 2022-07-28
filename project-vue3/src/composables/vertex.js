export function vertex(x,y,r,col) {
      this.x = x
      this.y = y
      this.r = r
      this.col = col
    
    this.checkPoint = (p5,tox,toy) => {
        var d = p5.dist(p5.mouseX,p5.mouseY, this.x - tox, this.y - toy)
        return d < this.r 
    }

    this.clicked = (p5) => {
      var d = p5.dist(p5.mouseX,p5.mouseY, this.x, this.y)
      if (d < this.r) {
        return true
      }
      return false
    }

    this.drag = (p5,tox,toy) => {
      this.x = p5.mouseX + tox
      this.y = p5.mouseY + toy
      const dragEvent=new CustomEvent("drag")
      document.dispatchEvent(dragEvent)
    }

    this.dragAll = (p5) => {
      this.x = this.x + (p5.mouseX - p5.pmouseX)
      this.y = this.y + (p5.mouseY - p5.pmouseY)
      const dragAllEvent=new CustomEvent("dragAll")
      document.dispatchEvent(dragAllEvent)
    }

    this.show = (p5) => {
      p5.stroke(this.col)
      p5.strokeWeight(2)
      p5.noFill()
      p5.ellipse(this.x, this.y, this.r * 2)

    }

    this.released = (id) => {
      //console.log("released",id)
      // fetch(`http://localhost:3000/shapesVertex/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //                        x: this.x ,
      //                        y: this.y
      //                        })
      // }).then(() => {
      //   console.log("updated",id)
      // }).catch(err => console.log(err))
    }
  }