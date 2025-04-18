import React, { useEffect, useState } from 'react'

// Mapping of shape types 
const shapeConfigs = {
  rect: ['width', 'height', 'color'],
  square: ['width', 'height', 'color'],
  triangle: ['width', 'height', 'color'],
  image: ['width', 'height'],
  circle: ['diameter', 'color'],
}

function Settings({ canvas }) {
  const [selectedObj, setSelectedObj] = useState(null)
  //console.log(selectedObj)
  const [settings, setSettings] = useState({
    width: '',
    height: '',
    diameter: '',
    color: '',
  })

  useEffect(() => {
    if (!canvas) return
   // Handle selection events from the canvas
    const handleSelection = (e) => {
      const obj = e.selected ? e.selected[0] : e.target
      setSelectedObj(obj)
      populateSettings(obj)
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', () => {
      setSelectedObj(null)
      clearSettings()
    })

    return () => {
      canvas.off('selection:created', handleSelection)
      canvas.off('selection:updated', handleSelection)
      canvas.off('selection:cleared')
    }
  }, [canvas])

    // Populate settings input values based on selected object's current properties
  const populateSettings = (obj) => {
    if (!obj) return

    const { type, scaleX = 1, scaleY = 1, fill = '', width, height, radius } = obj

    const newSettings = {
      width: width ? Math.round(width * scaleX) : '',
      height: height ? Math.round(height * scaleY) : '',
      diameter: radius ? Math.round(radius * scaleX * 2) : '',
      color: fill || '',
    }

    setSettings(newSettings)
  }

  const clearSettings = () => {
    setSettings({ width: '', height: '', diameter: '', color: '' })
  }

  const updateObject = (key, value) => {
    if (!selectedObj) return
  

    const numValue = parseFloat(value)

    switch (key) {
      case 'width':
        selectedObj.set('width', numValue / selectedObj.scaleX)
        break
      case 'height':
        selectedObj.set('height', numValue / selectedObj.scaleY)
        break
      case 'diameter':
        selectedObj.set('radius', numValue / 2 / selectedObj.scaleX)
        break
      case 'color':
        selectedObj.set('fill', value)
        break
      default:
        break
    }

    selectedObj.setCoords()
    canvas.requestRenderAll()
  }

  const handleChange = (key) => (e) => {
    const value = e.target.value
    setSettings((prev) => ({ ...prev, [key]: value }))
    updateObject(key, value)
  }

  const renderInput = (key) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1)
    const type = key === 'color' ? 'color' : 'number'

    return (
      <div key={key} >
        {label}: <input type={type} value={settings[key]} onChange={handleChange(key)}/>
      </div>
    )
  }
  // Determine which inputs to render based on selected object type
  const activeKeys = selectedObj ? shapeConfigs[selectedObj.type] || [] : []

  return (
    <div className="settings p-4 bg-gray-100 rounded-lg w-64">
      {selectedObj ? (
        <div>
          <h2>{selectedObj.type} Settings</h2>
          {activeKeys.map(renderInput)}
        </div>
      ) : (
        <p>No object selected</p>
      )}
    </div>
  )
}

export default Settings
