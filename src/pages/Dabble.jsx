import React, { useRef, useState } from 'react'
import ToolbarLeft from '../components/ToolbarLeft'
import TooblarRight from '../components/TooblarRight'
import { useFabricCanvas } from '../hooks/useFabricCanvas'
import { useCanvasResize } from '../hooks/useCanvasResize'
import ToolbarBottom from '../components/ToolbarBottom'
import ToolbarTop from '../components/ToolbarTop'
import LayerLists from '../components/LayerLists'

function Dabble() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [activeBrush, setActiveBrush] = useState()
  const [activeTab, setActiveTab] = useState('settings') // 'settings' or 'layers'
  
  const { canvas, dimensions, setDimensions } = useFabricCanvas(
    canvasRef,
    containerRef,
    window.innerWidth > 768 ? 1080 : window.innerWidth - 40,
    window.innerHeight > 768 ? 720 : window.innerHeight - 40
  )

  useCanvasResize(canvas, containerRef, setDimensions)

  return (
    <>
      <ToolbarTop canvas={canvas} dimensions={dimensions} setDimensions={setDimensions} />
      <div className='canvas-container'>
        <div className='canvas-main'>
          <ToolbarLeft canvas={canvas} activeBrush={activeBrush} setActiveBrush={setActiveBrush}/>
          <div className='canvas' ref={containerRef}>
            <canvas id='canvas' ref={canvasRef} />
          </div>
          <div className='toolbar-right'>
            <div className="toolbar-tabs">
              <button 
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <span className="tab-icon">⚙️</span>
                Settings
              </button>
              <button 
                className={`tab-button ${activeTab === 'layers' ? 'active' : ''}`}
                onClick={() => setActiveTab('layers')}
              >
                <span className="tab-icon">📚</span>
                Layers
              </button>
            </div>
            <div className="tab-content">
              <div className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}>
                <TooblarRight canvas={canvas} activeBrush={activeBrush}/>
              </div>
              <div className={`tab-pane ${activeTab === 'layers' ? 'active' : ''}`}>
                <LayerLists canvas={canvas}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToolbarBottom canvas={canvas} />
    </>
  )
}

export default Dabble