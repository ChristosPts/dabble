import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import CanvasSettings from './CanvasSettings'
import ExportButtons from './ExportButtons'
import "../css/toolbar-top.css"

function ToolbarTop({ canvas, dimensions, setDimensions }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="toolbar-top">
      <div className="left-section">
        <span className='logo'>Dabble</span>

        <Dropdown label="Canvas Settings">
          <CanvasSettings canvas={canvas} dimensions={dimensions} setDimensions={setDimensions} />
        </Dropdown>

        <Dropdown label="Export Options">
          <ExportButtons canvas={canvas} onExport={() => {}} />
        </Dropdown>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}

export default ToolbarTop
