import React, { useRef, useState } from 'react'
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
  const [activeBrush, setActiveBrush] = useState()
  const { canvas, dimensions, setDimensions } = useFabricCanvas(
    canvasRef,
    containerRef,
    window.innerWidth > 768 ? 1080 : window.innerWidth - 40,
    window.innerHeight > 768 ? 720 : window.innerHeight - 40
  )

  useCanvasResize(canvas, containerRef, setDimensions)

  return (
    <>
    <ToolbarTop canvas={canvas}  dimensions={dimensions} setDimensions={setDimensions} />
      <div className='canvas-container'>
      
        <div className='canvas-main'>
          <ToolbarLeft canvas={canvas} activeBrush={activeBrush} setActiveBrush={setActiveBrush}/>
          <div className='canvas' ref={containerRef}>
            <canvas id='canvas' ref={canvasRef} />
          </div>
          <div className='toolbar-right'>
            <TooblarRight canvas={canvas} activeBrush={activeBrush}/>
            <LayerLists canvas={canvas}/>
          </div>
        </div>
      </div>
      <ToolbarBottom canvas={canvas} />
    </>
  )
}

export default Dabble
