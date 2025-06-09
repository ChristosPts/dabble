import React, { useState, useRef, useEffect } from 'react'

const Dropdown = ({ label, children, icon }) => {
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

  // Apply open class to container for styling
  const containerClass = `dropdown-container ${open ? 'open' : ''}`

  return (
    <div className={containerClass} ref={dropdownRef}>
      <button className="dropdown-buttons" onClick={handleToggle}>
        {icon && <span className="dropdown-icon">{icon}</span>}
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