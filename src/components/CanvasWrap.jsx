import { Canvas } from 'fabric'
import React, { useEffect, useRef, useState } from 'react'
import Toolbar from './Toolbar'
import '../css/toolbar.css'
import Settings from './Settings'

function CanvasWrap() {
   const canvasRef = useRef(null)
   const [canvas, setCanvas] = useState(null)
   const [dimensions, setDimensions] = useState({
     width: window.innerWidth > 768 ? 500 : window.innerWidth - 40,
     height: window.innerWidth > 768 ? 500 : window.innerWidth - 40
   })

   useEffect(() => {
     if(canvasRef.current){
      // Initialize Fabric.js canvas with the referenced <canvas> element
        const initCanvas = new Canvas(canvasRef.current, {
            width: dimensions.width,
            height: dimensions.height,
        })

        // Set background color and render the canvas
        initCanvas.backgroundColor = "#fff"
        initCanvas.renderAll()
        
        setCanvas(initCanvas)
        
        // Handle window resize
        const handleResize = () => {
          const newWidth = window.innerWidth > 768 ? 500 : window.innerWidth - 40
          const newHeight = window.innerWidth > 768 ? 500 : window.innerWidth - 40
          
          initCanvas.setWidth(newWidth)
          initCanvas.setHeight(newHeight)
          initCanvas.renderAll()
          
          setDimensions({ width: newWidth, height: newHeight })
        }
        
        window.addEventListener('resize', handleResize)
        
        return () => {
          window.removeEventListener('resize', handleResize)
          initCanvas.dispose()
        }
      }
   }, [])
   
   return (
    <div className='canvas-wrap'>
      <div className='canvas-main'>
        <Toolbar canvas={canvas}/>
        <div className='canvas'>
            <canvas id="canvas" ref={canvasRef}/>
          </div>
        <Settings canvas={canvas}/>
      </div>
     </div>
  )
}

export default CanvasWrap