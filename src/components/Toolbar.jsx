import { Circle, Rect, Triangle } from 'fabric'
import React from 'react'
import ImageUploader from './ImageUploader'

function Toolbar({canvas}) {

  const addRectangle = () => {
    if(canvas) {
        const rectangle = new Rect({ top: 100, left: 50, width: 100, height:50, fill: '#23eb23' })
        canvas.add(rectangle)
    }
  }

  const addSquare = () => {
    if(canvas) {
        const square = new Rect({ top: 100, left: 50, width: 50, height:50, fill: '#ff0000' })
        canvas.add(square)
    }
  }

  const addTriangle = () => {
    if(canvas) {
        const triangle = new Triangle({ top: 100, left: 50, width: 50, height:50, fill: '#0008ff' })
        canvas.add(triangle)
    }
  }

  const addCircle = () => {
    if(canvas) {
        const circle = new Circle({ top: 100, left: 50, radius: 30, fill: '#fbff00' })
        canvas.add(circle)
    }
  }

  return (
    <div className='toolbar'>
        <div>
        <button onClick={addRectangle}>&#9645;</button>
        <button onClick={addSquare}>&#8414;</button>
        <ImageUploader canvas = {canvas}/>
        </div>
        <div>
        <button onClick={addTriangle}>&#8420;</button>
        <button onClick={addCircle}>&#9711;</button>
        </div>
    </div>
  )
}

export default Toolbar