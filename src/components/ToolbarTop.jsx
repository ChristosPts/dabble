import React, { useEffect, useState, useRef } from 'react'
import Dropdown from './Dropdown'
import CanvasSettings from './CanvasSettings'
import ExportButtons from './ExportButtons'
import "../css/toolbar-top.css"

function ToolbarTop({ canvas, dimensions, setDimensions }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && 
          !e.target.classList.contains('burger-menu')) {
        setSidebarOpen(false)
      }
    }
    
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <>
      {/* Main Toolbar */}
      <div className="toolbar-top">
        <div className="left-section">
          <button 
            className="burger-menu"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <span className='logo'>Dabble</span>

          {/* Only show these on desktop */}
          <div className="desktop-menu">
            <Dropdown 
              label="Canvas" 
              icon="📐"
            >
              <CanvasSettings canvas={canvas} dimensions={dimensions} setDimensions={setDimensions} />
            </Dropdown>

            <Dropdown 
              label="Export" 
              icon="📤"
            >
              <ExportButtons canvas={canvas} onExport={() => {}} />
            </Dropdown>
          </div>
        </div>

        <div className="right-section">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <span className="logo">Dabble</span>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <span className="sidebar-icon">📐</span> Canvas Settings
            </h3>
            <div className="sidebar-item-content">
              <CanvasSettings canvas={canvas} dimensions={dimensions} setDimensions={setDimensions} />
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <span className="sidebar-icon">📤</span> Export Options
            </h3>
            <div className="sidebar-item-content">
              <ExportButtons canvas={canvas} onExport={() => {}} />
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="theme-toggle-container">
            <span>Theme:</span>
            <button 
              className="theme-toggle-sidebar" 
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for sidebar */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      ></div>
    </>
  )
}

export default ToolbarTop