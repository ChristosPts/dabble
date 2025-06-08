// Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react'


const Dropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef()

  const handleToggle = () => setOpen(prev => !prev)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-buttons" onClick={handleToggle}>
        {label}
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdown-menu">{children}</div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
