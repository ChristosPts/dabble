import React, { useEffect, useState } from 'react';
import LayerLists from './LayerLists';

const shapeConfigs = {
  rect: ['width', 'height', 'color'],
  square: ['width', 'height', 'color'],
  triangle: ['width', 'height', 'color'],
  image: ['width', 'height'],
  circle: ['diameter', 'color'],
}

function TooblarRight({ canvas }) {
  const [selectedObj, setSelectedObj] = useState(null)
   
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
    
    // Set up keyboard event listener for delete key
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
        deleteSelectedObjects()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      canvas.off('selection:created', handleSelection)
      canvas.off('selection:updated', handleSelection)
      canvas.off('selection:cleared');
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [canvas])

  // Delete the currently selected object(s)
  const deleteSelectedObjects = () => {
    if (!canvas) return
    
    const activeObject = canvas.getActiveObject()
    
    if (activeObject) {
      // If it's a group of objects
      if (activeObject.type === 'activeSelection') {
        // Remove all objects in the selection
        activeObject.forEachObject((obj) => {
          canvas.remove(obj)
        })
      } else {
        // Remove the single selected object
        canvas.remove(activeObject)
      }
      
      // Clear selection and render canvas
      canvas.discardActiveObject()
      canvas.requestRenderAll()
      
      // Clear local state
      setSelectedObj(null)
      clearSettings()
    }
  }

  // Populate settings input values based on selected object's current properties
  const populateSettings = (obj) => {
    if (!obj) return;
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
    if (!selectedObj) return;
 
    const numValue = parseFloat(value);
    switch (key) {
      case 'width':
        selectedObj.set('width', numValue / selectedObj.scaleX);
        break;
      case 'height':
        selectedObj.set('height', numValue / selectedObj.scaleY);
        break;
      case 'diameter':
        selectedObj.set('radius', numValue / 2 / selectedObj.scaleX);
        break;
      case 'color':
        selectedObj.set('fill', value);
        break;
      default:
        break;
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
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const type = key === 'color' ? 'color' : 'number';
    return (
      <div key={key}>
        {label}: <input type={type} value={settings[key]} onChange={handleChange(key)}/>
      </div>
    )
  }

  // Determine which inputs to render based on selected object type
  const activeKeys = selectedObj ? shapeConfigs[selectedObj.type] || [] : []
  
  return (
    <div className="object-settings">
      {selectedObj ? (
        <div>
          <h1>Settings</h1>
          {activeKeys.map(renderInput)}
          
          {/* Delete button */}
          <button onClick={deleteSelectedObjects}>
            Delete Object
          </button>
        </div>
      ) : (
        <>
          <h1>Settings</h1>
          <p>No object selected</p>
        </>
      )}
      
    </div>
  )
}

export default TooblarRight