import React, { useRef } from 'react'
import Toolbar from '../components/Toolbar'
import Settings from '../components/Settings'
import CanvasSettings from '../components/CanvasSettings'
import { useFabricCanvas } from '../hooks/useFabricCanvas'
import { useCanvasResize } from '../hooks/useCanvasResize'
import '../css/toolbar.css'

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
      <div className='canvas-wrap'>
        <div className='canvas-main'>
          <Toolbar canvas={canvas} />
          <div className='canvas' ref={containerRef}>
            <canvas id='canvas' ref={canvasRef} />
          </div>
          <Settings canvas={canvas} />
        </div>
      </div>
      <CanvasSettings canvas={canvas} dimensions={dimensions} setDimensions={setDimensions} />
    </>
  )
}

export default Dabble
