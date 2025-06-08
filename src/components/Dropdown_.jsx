import React, { useState, useRef, useEffect } from 'react'
import CanvasSettings from './CanvasSettings'
import ExportButtons from './ExportButtons'
import "../css/dropdown.css"

const Dropdown = ({ canvas, dimensions, setDimensions }) => {
  const [open, setOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')
  const dropdownRef = useRef()

  // Toggle dropdown open/closed
  const handleToggle = () => {
    setOpen(!open)
    setActiveMenu('main')
  }

  // Navigate to a submenu
  const navigateTo = (menuName) => {
    setActiveMenu(menuName)
  }

  // Go back to main menu
  const goBack = () => {
    setActiveMenu('main')
  }

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  // Function to close dropdown after an action
  const closeDropdown = () => {
    setOpen(false)
  }

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <button className="dropdown-trigger" onClick={handleToggle}>
        ☰ Menu
      </button>

      {open && (
        <div className="dropdown-container">
          {activeMenu !== 'main' && (
            <div className="dropdown-header" onClick={goBack}>
              ← Back
            </div>
          )}
          
          {/* Main Menu */}
          {activeMenu === 'main' && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => navigateTo('canvas')}>
                Canvas Settings <span className="arrow">›</span>
              </div>
              <div className="dropdown-item" onClick={() => navigateTo('export')}>
                Export Options <span className="arrow">›</span>
              </div>
            </div>
          )}
          
          {/* Canvas Settings Submenu */}
          {activeMenu === 'canvas' && (
            <div className="dropdown-menu">
              <CanvasSettings 
                canvas={canvas} 
                dimensions={dimensions} 
                setDimensions={setDimensions} 
             
              />
            </div>
          )}
          
          {/* Export Options Submenu */}
          {activeMenu === 'export' && (
            <div className="dropdown-menu">
              <ExportButtons 
                canvas={canvas} 
            
                onExport={closeDropdown} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dropdown