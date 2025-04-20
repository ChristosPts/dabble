import React from 'react'
import useSnapping from '../hooks/useSnapping'

const SnappingToggle = ({ canvas }) => {
  const { snappingEnabled, toggleSnapping } = useSnapping(canvas)

  return (
    <div className="snapping-toggle">
      <button 
        className={`toggle-button ${snappingEnabled ? 'active' : ''}`}
        onClick={toggleSnapping}
        title={snappingEnabled ? "Disable Snapping" : "Enable Snapping"}
      >
        {snappingEnabled ? 'Snapping: On' : 'Snapping: Off'}
      </button>
    </div>
  )
}

export default SnappingToggle