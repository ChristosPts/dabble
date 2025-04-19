import { Canvas } from 'fabric'
import React, { useEffect, useRef, useState } from 'react'
import Toolbar from './Toolbar'
import '../css/toolbar.css'
 import Settings from './Settings'
import CanvasSettings from './CanvasSettings'

function CanvasWrap() {
   const canvasRef = useRef(null)
   const canvasContainerRef = useRef(null)
   const [canvas, setCanvas] = useState(null)
   const [dimensions, setDimensions] = useState({
     width: window.innerWidth > 768 ? 500 : window.innerWidth - 40,
     height: window.innerWidth > 768 ? 500 : window.innerWidth - 40
   })
   
   useEffect(() => {
     if(canvasRef.current && canvasContainerRef.current){
       // Get container dimensions
       const container = canvasContainerRef.current;
       const containerWidth = container.clientWidth;
       const containerHeight = container.clientHeight;
       
       // Determine initial canvas size
       const initialWidth = Math.min(dimensions.width, containerWidth);
       const initialHeight = Math.min(dimensions.height, containerHeight);
       
       // Initialize Fabric.js canvas with constrained dimensions
       const initCanvas = new Canvas(canvasRef.current, {
         width: initialWidth,
         height: initialHeight,
       });
       
       // Set background color and render the canvas
       initCanvas.backgroundColor = "#fff";
       initCanvas.renderAll();
       
       setCanvas(initCanvas);
       setDimensions({
         width: initialWidth,
         height: initialHeight
       });
       
       // Handle window resize
       const handleResize = () => {
         // Only adjust if canvas exists
         if (!initCanvas) return;
         
         // Check if container dimensions have changed
         const newContainerWidth = container.clientWidth;
         const newContainerHeight = container.clientHeight;
         
         // If current canvas size exceeds container, constrain it
         if (initCanvas.width > newContainerWidth || initCanvas.height > newContainerHeight) {
           const newWidth = Math.min(initCanvas.width, newContainerWidth);
           const newHeight = Math.min(initCanvas.height, newContainerHeight);
           
           initCanvas.setWidth(newWidth);
           initCanvas.setHeight(newHeight);
           initCanvas.renderAll();
           
           setDimensions({
             width: newWidth,
             height: newHeight
           });
         }
       };
       
       window.addEventListener('resize', handleResize);
       
       return () => {
         window.removeEventListener('resize', handleResize);
         initCanvas.dispose();
       };
     }
   }, []);
   
   return (
    <>
      <div className='canvas-wrap'>
        <div className='canvas-main'>
         
            <Toolbar canvas={canvas}/>
        
          
          <div className='canvas' ref={canvasContainerRef}>
            <canvas id="canvas" ref={canvasRef}/>
          </div>
          <Settings canvas={canvas}/>
        </div>
      </div>
      <CanvasSettings 
          canvas={canvas} 
          dimensions={dimensions} 
          setDimensions={setDimensions} 
      />
    </>
  )
}

export default CanvasWrap