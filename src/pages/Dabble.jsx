import React, { useRef } from 'react'
import ToolbarLeft from '../components/ToolbarLeft'
import TooblarRight from '../components/TooblarRight'
import { useFabricCanvas } from '../hooks/useFabricCanvas'
import { useCanvasResize } from '../hooks/useCanvasResize'
import '../css/toolbar.css'
import ToolbarBottom from '../components/ToolbarBottom'
import ToolbarTop from '../components/ToolbarTop'
import LayerLists from '../components/LayerLists'

function Dabble() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const { canvas, dimensions, setDimensions } = useFabricCanvas(
    canvasRef,
    containerRef,
    window.innerWidth > 768 ? 500 : window.innerWidth - 40,
    window.innerWidth > 768 ? 500 : window.innerWidth - 40
  )

  useCanvasResize(canvas, containerRef, setDimensions)

  return (
    <>
    <ToolbarTop canvas={canvas}  dimensions={dimensions} setDimensions={setDimensions} />
      <div className='canvas-container'>
      
        <div className='canvas-main'>
          <ToolbarLeft canvas={canvas} />
          <div className='canvas' ref={containerRef}>
            <canvas id='canvas' ref={canvasRef} />
          </div>
          <div className='toolbar-right'>
            <TooblarRight canvas={canvas} />
            <LayerLists canvas={canvas}/>
          </div>
        </div>
      </div>
      <ToolbarBottom canvas={canvas} />
    </>
  )
}

export default Dabble
