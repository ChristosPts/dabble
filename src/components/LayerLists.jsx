import { Canvas } from 'fabric'
import React, { useEffect, useState } from 'react'

function LayerLists({canvas}) {
    const [layers, setLayers] = useState([])
    const [selectedLayer, setSelectedLayer] = useState(null)
    const [lockedLayers, setLockedLayers] = useState({}) 
    const [hiddenLayers, setHiddenLayers] = useState({}) 

    const moveSelectedLayer = (direction) => {
        if (!selectedLayer || !canvas) return
    
        const objects = canvas.getObjects()
        const index = objects.findIndex(obj => obj.id === selectedLayer)
    
        if (index === -1) return
        
        if (direction === "up") {
            if (index === objects.length - 1) return
            
            const currentObj = objects[index]
            
            // Use the correct method name for Fabric.js
            canvas.bringObjectForward(currentObj)
        } else {
            if (index === 0) return
            
            const currentObj = objects[index]
            
            // Use the correct method name for Fabric.js
            canvas.sendObjectBackwards(currentObj)
        }
        
        canvas.requestRenderAll()
        updateLayers()
        
        const movedObj = direction === "up" 
            ? canvas.getObjects()[index + 1] 
            : canvas.getObjects()[index - 1]
            
        if (movedObj) {
            canvas.setActiveObject(movedObj)
            canvas.requestRenderAll()
        }
    }
    
    const addIdToObject = (obj) => {
        if(!obj.id) {
            const timestamp = new Date().getTime()
            obj.id = `${obj.type}_${timestamp}`
        }
    }

    Canvas.prototype.updateZIndices = function () {
        const objects = this.getObjects()
        objects.forEach((obj, index) => {
            addIdToObject(obj)
            obj.zIndex = index
        })
    }

    const updateLayers = () => {
        if(canvas) {
            canvas.updateZIndices()
            const objects = canvas
                .getObjects()
                .filter(
                    (obj) =>
                        !(
                            obj.id?.startsWith("vertical-") || obj.id?.startsWith("horizontal-")
                        )
                )
                .map((obj) => ({
                    id: obj.id,
                    zIndex: obj.zIndex,
                    type: obj.type,
                    locked: !!lockedLayers[obj.id], // Include locked state in layer data
                    hidden: !!hiddenLayers[obj.id]  // Include hidden state in layer data
                }))
            
            setLayers([...objects].reverse())
        }
    }

    const handleObjectSelected = (e) => {
        const selectedObject = e.selected ? e.selected[0] : null

        if(selectedObject) {
            setSelectedLayer(selectedObject.id)
        } else {
            setSelectedLayer(null)
        }
    }

    const selectLayerInCanvas = (layerId) => {
        // Don't allow selecting locked or hidden layers
        if (lockedLayers[layerId] || hiddenLayers[layerId]) return
        
        const object = canvas.getObjects().find((obj) => obj.id === layerId)
        if(object) {
            canvas.setActiveObject(object)
            canvas.requestRenderAll()
            setSelectedLayer(layerId)
        }
    }

    // Toggle lock status for a layer
    const toggleLayerLock = (layerId, event) => {
        // Stop event propagation to prevent selecting the layer when clicking the lock icon
        event.stopPropagation()
        
        const object = canvas.getObjects().find((obj) => obj.id === layerId)
        if (!object) return

        // Update lock status in our state
        setLockedLayers(prev => {
            const newLockedLayers = { ...prev }
            
            if (newLockedLayers[layerId]) {
                // Unlock layer
                delete newLockedLayers[layerId]
                
                // Make object selectable and editable again
                object.selectable = true
                object.evented = true
                object.lockMovementX = false
                object.lockMovementY = false
                object.lockRotation = false
                object.lockScalingX = false
                object.lockScalingY = false
                object.lockSkewingX = false
                object.lockSkewingY = false
                
                // If this was the selected layer before locking, re-select it
                if (selectedLayer === layerId) {
                    canvas.setActiveObject(object)
                }
            } else {
                // Lock layer
                newLockedLayers[layerId] = true
                
                // Make object non-selectable and non-editable
                object.selectable = false
                object.evented = false
                object.lockMovementX = true
                object.lockMovementY = true
                object.lockRotation = true
                object.lockScalingX = true
                object.lockScalingY = true
                object.lockSkewingX = true
                object.lockSkewingY = true
                
                // If this is the currently selected layer, deselect it
                if (selectedLayer === layerId) {
                    canvas.discardActiveObject()
                    setSelectedLayer(null)
                }
            }
            
            return newLockedLayers
        })
        
        canvas.requestRenderAll()
        updateLayers()
    }

    // Toggle visibility status for a layer
    const toggleLayerVisibility = (layerId, event) => {
        // Stop event propagation to prevent selecting the layer when clicking the visibility icon
        event.stopPropagation()
        
        const object = canvas.getObjects().find((obj) => obj.id === layerId)
        if (!object) return

        // Update hidden status in our state
        setHiddenLayers(prev => {
            const newHiddenLayers = { ...prev }
            
            if (newHiddenLayers[layerId]) {
                // Show layer
                delete newHiddenLayers[layerId]
                object.visible = true
                
                // If this was the selected layer before hiding, re-select it
                if (selectedLayer === layerId && !lockedLayers[layerId]) {
                    canvas.setActiveObject(object)
                }
            } else {
                // Hide layer
                newHiddenLayers[layerId] = true
                object.visible = false
                
                // If this is the currently selected layer, deselect it
                if (selectedLayer === layerId) {
                    canvas.discardActiveObject()
                    setSelectedLayer(null)
                }
            }
            
            return newHiddenLayers
        })
        
        canvas.requestRenderAll()
        updateLayers()
    }

    useEffect(() => {
        if(canvas) {
            canvas.on("object:added", updateLayers)
            canvas.on("object:removed", updateLayers)
            canvas.on("object:modified", updateLayers)
            canvas.on("selection:created", handleObjectSelected)
            canvas.on("selection:updated", handleObjectSelected)
            canvas.on("selection:cleared", () => setSelectedLayer(null))

            updateLayers()

            return () => {
                canvas.off("object:added", updateLayers)
                canvas.off("object:removed", updateLayers)
                canvas.off("object:modified", updateLayers)
                canvas.off("selection:created", handleObjectSelected)
                canvas.off("selection:updated", handleObjectSelected)
                canvas.off("selection:cleared", () => setSelectedLayer(null))
            }
        }
    },[canvas])

    // Function to determine if a layer is at the top (visually)
    const isTopLayer = (layerId) => {
        return layers[0]?.id === layerId;
    }
    
    // Function to determine if a layer is at the bottom (visually)
    const isBottomLayer = (layerId) => {
        return layers[layers.length - 1]?.id === layerId;
    }

    return (
        <div className="layer-list-container">  
        <h1>Layers</h1>
            <div className="layer-controls" style={{display:'flex', marginBottom: '10px'}}>
                <button 
                    onClick={() => moveSelectedLayer("up")}
                    disabled={!selectedLayer || isTopLayer(selectedLayer) || lockedLayers[selectedLayer]}
                    className="layer-button"
                >
                    Move Up
                </button>
                <button 
                    onClick={() => moveSelectedLayer("down")} 
                    disabled={!selectedLayer || isBottomLayer(selectedLayer) || lockedLayers[selectedLayer]}
                    className="layer-button"
                >
                    Move Down
                </button>
            </div>
            <ul className="layers-list">
            {layers.map((layer) => (
                <li 
                    key={layer.id} 
                    onClick={() => selectLayerInCanvas(layer.id)} 
                    className={`layer-item ${layer.id === selectedLayer ? "selected-layer" : ""} ${layer.locked ? "locked-layer" : ""} ${layer.hidden ? "hidden-layer" : ""}`}
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '8px',
                        cursor: layer.locked || layer.hidden ? 'not-allowed' : 'pointer',
                        backgroundColor: layer.id === selectedLayer ? '#e0e0e0' : 'transparent',
                        opacity: layer.hidden ? 0.5 : (layer.locked ? 0.7 : 1)
                    }}
                >
                    <span>{layer.type} ({layer.zIndex})</span>
                    <div className="layer-controls">
                        <button 
                            onClick={(e) => toggleLayerVisibility(layer.id, e)}
                            className="visibility-button"
                            style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer',
                                padding: '0 4px'
                            }}
                            title={layer.hidden ? "Show layer" : "Hide layer"}
                        >
                            {layer.hidden ? '👁️‍🗨️' : '👁️'}
                        </button>
                        <button 
                            onClick={(e) => toggleLayerLock(layer.id, e)}
                            className="lock-button"
                            style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer',
                                padding: '0 4px'
                            }}
                            title={layer.locked ? "Unlock layer" : "Lock layer"}
                        >
                            {layer.locked ? '🔒' : '🔓'}
                        </button>
                    </div>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default LayerLists