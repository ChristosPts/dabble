import { Rect, Circle, Triangle, Line, IText, Polygon } from 'fabric'

function useShapeTools(canvas, isDrawing, setIsDrawing, setActiveBrush) {
  const addShape = (Shape, properties) => {
    if (canvas) {
      const shape = new Shape(properties)
      canvas.add(shape)
      canvas.setActiveObject(shape)

      // Exit drawing mode if active
      if (isDrawing) {
        setIsDrawing(false)
        canvas.isDrawingMode = false
        setActiveBrush('')
      }
    }
  }

  const addRectangle = () => {
    addShape(Rect, { top: 100, left: 50, width: 100, height: 50, fill: '#23eb23', strokeWidth: 0, stroke: '#333333' })
  }

  const addSquare = () => {
    addShape(Rect, { top: 100, left: 50, width: 50, height: 50, fill: '#ff0000', strokeWidth: 0, stroke: '#333333' })
  }

  const addTriangle = () => {
    addShape(Triangle, { top: 100, left: 50, width: 50, height: 50, fill: '#0008ff', strokeWidth: 0, stroke: '#333333' })
  }

  const addCircle = () => {
    addShape(Circle, { top: 100, left: 50, radius: 30, fill: '#fbff00', strokeWidth: 0, stroke: '#333333' })
  }

 

  const addLine = () => {
    if (canvas) {
      const line = new Line([50, 100, 200, 100], { strokeWidth: 5, stroke: '#000000' })
      canvas.add(line)
      canvas.setActiveObject(line)

      // Exit drawing mode if active
      if (isDrawing) {
        setIsDrawing(false)
        canvas.isDrawingMode = false
        setActiveBrush('')
      }
    }
  }

  const addText = () => {
    if (canvas) {
      const text = new IText('Double-click to edit', {
        left: 100,
        top: 100,
        fill: '#000000',
        fontSize: 24,
        stroke: '#ffffff',
        strokeWidth: 0,
        editable: true
      });
      canvas.add(text)
      canvas.setActiveObject(text)

      // Exit drawing mode if active
      if (isDrawing) {
        setIsDrawing(false)
        canvas.isDrawingMode = false
        setActiveBrush('')
      }
    }
  }

  return { addRectangle, addSquare, addTriangle, addCircle, addLine, addText }
}

export default useShapeTools
