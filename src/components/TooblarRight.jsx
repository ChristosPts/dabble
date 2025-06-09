import React, { useEffect, useState } from 'react';
import { shapeConfigs, brushConfigs, defaultShapeSettings } from '../utils/shapeConfig';
import { updateObject, updateBrush, deleteSelectedObjects } from '../utils/canvasHelper';
import { isImage } from '../utils/filterUtils';
import ImageFilters from './ImageFilters';
import '../css/toolbar-right.css'

function ToolbarRight({ canvas, activeBrush }) {
  const [selectedObj, setSelectedObj] = useState(null);
  const [isBrushActive, setIsBrushActive] = useState(false);
  const [settings, setSettings] = useState({ ...defaultShapeSettings });

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e) => {
      const obj = e.selected ? e.selected[0] : e.target;
      setSelectedObj(obj);
      setIsBrushActive(false);
      populateSettings(obj);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && canvas.getActiveObject()) {
        handleDelete();
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      setSelectedObj(null);
      if (!activeBrush) {
        clearSettings();
      }
    });

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas]);

  useEffect(() => {
    if (activeBrush) {
      setIsBrushActive(true);
      setSelectedObj(null);

      if (canvas && canvas.freeDrawingBrush) {
        setSettings(prev => ({
          ...prev,
          color: canvas.freeDrawingBrush.color || '#000000',
          width: canvas.freeDrawingBrush.width || 5,
          opacity: canvas.freeDrawingBrush.opacity !== undefined
            ? Math.round(canvas.freeDrawingBrush.opacity * 100)
            : 100,
        }));
      }
    } else {
      setIsBrushActive(false);
    }
  }, [activeBrush, canvas]);

  const populateSettings = (obj) => {
    if (!obj) return;

    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    const shadow = obj.shadow || {};

    setSettings({
      ...defaultShapeSettings,
      width: obj.width ? Math.round(obj.width * scaleX) : '',
      height: obj.height ? Math.round(obj.height * scaleY) : '',
      diameter: obj.radius ? Math.round(obj.radius * scaleX * 2) : '',
      fill: obj.fill || '',
      stroke: obj.stroke || '',
      strokeWidth: obj.strokeWidth || '',
      strokeDashArray: obj.strokeDashArray?.length ? 'dashed' : 'solid',
      fontSize: obj.fontSize || '',
      text: obj.text || '',
      fontFamily: obj.fontFamily || 'Arial',
      opacity: obj.opacity !== undefined ? Math.round(obj.opacity * 100) : 100,
      shadowColor: shadow.color || '#000000',
      shadowOffsetX: shadow.offsetX || 0,
      shadowOffsetY: shadow.offsetY || 0,
      shadowBlur: shadow.blur || 0
    });
  };

  const clearSettings = () => {
    setSettings({ ...defaultShapeSettings });
  };

  const handleDelete = () => {
    deleteSelectedObjects(canvas);
    setSelectedObj(null);
    clearSettings();
  };

  const handleChange = (key) => (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;

    let processedValue = value;
    if (key === 'width' && isBrushActive) {
      processedValue = Math.max(1, Math.min(100, parseInt(value) || 1));
    }

    setSettings((prev) => ({ ...prev, [key]: processedValue }));

    if (isBrushActive && canvas.freeDrawingBrush) {
      updateBrush(canvas.freeDrawingBrush, key, processedValue, canvas);
    } else if (selectedObj) {
      if (['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur'].includes(key)) {
        const currentShadow = selectedObj.shadow || {};
        const newShadow = {
          color: key === 'shadowColor' ? value : currentShadow.color || '#000000',
          offsetX: key === 'shadowOffsetX' ? value : currentShadow.offsetX || 0,
          offsetY: key === 'shadowOffsetY' ? value : currentShadow.offsetY || 0,
          blur: key === 'shadowBlur' ? value : currentShadow.blur || 0
        };
        selectedObj.set('shadow', newShadow);
        canvas.requestRenderAll();
      } else {
        updateObject(selectedObj, key, processedValue, canvas);
      }
    }
  };

  const incrementNumber = (key, step = 1) => {
    const currentValue = parseFloat(settings[key]) || 0;
    const newValue = currentValue + step;
    handleChange(key)({ target: { type: 'number', value: newValue } });
  };

  const decrementNumber = (key, step = 1) => {
    const currentValue = parseFloat(settings[key]) || 0;
    const newValue = currentValue - step;
    handleChange(key)({ target: { type: 'number', value: newValue } });
  };

  const renderInput = (key) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const inputConfigs = {
      strokeDashArray: {
        type: 'select',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' }
        ]
      },
      fontFamily: {
        type: 'select',
        label: 'Font Family',
        options: [
          { value: 'Arial', label: 'Arial' },
          { value: 'Helvetica', label: 'Helvetica' },
          { value: 'Times New Roman', label: 'Times New Roman' },
          { value: 'Courier New', label: 'Courier New' },
          { value: 'Georgia', label: 'Georgia' },
          { value: 'Comic Sans MS', label: 'Comic Sans' },
          { value: 'Verdana', label: 'Verdana' }
        ]
      },
      patternType: {
        type: 'select',
        label: 'Pattern Type',
        options: [
          { value: 'simple', label: 'Simple' },
          { value: 'dots', label: 'Dots' },
          { value: 'zigzag', label: 'Zigzag' }
        ]
      },
      opacity: {
        type: 'range',
        label: 'Opacity (%)',
        min: 0,
        max: 100
      },
      width: {
        type: 'number',
        label: isBrushActive ? 'Width (px)' : 'Width',
        min: isBrushActive ? 1 : undefined,
        max: isBrushActive ? 100 : undefined
      },
      sprayDensity: {
        type: 'number',
        min: 1,
        max: 100
      },
      sprayWidth: {
        type: 'number',
        label: 'Spray Width (px)',
        min: 1,
        max: 100
      },
      color: { type: 'color' },
      fill: { type: 'color' },
      stroke: { type: 'color' },
      text: { type: 'text' },
      shadowColor: { type: 'color', label: 'Shadow Color' },
      shadowOffsetX: { type: 'number', label: 'Shadow X Offset' },
      shadowOffsetY: { type: 'number', label: 'Shadow Y Offset' },
      shadowBlur: { type: 'number', label: 'Shadow Blur' }
    };

    const config = inputConfigs[key] || { type: 'number' };
    const inputLabel = config.label || label;

    switch (config.type) {
      case 'select':
        return (
          <div className="input-group" key={key}>
            <label htmlFor={`input-${key}`}>{inputLabel}</label>
            <select 
              id={`input-${key}`}
              value={settings[key]} 
              onChange={handleChange(key)}
            >
              {config.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        );

      case 'color':
        return (
          <div className="input-group" key={key}>
            <label htmlFor={`input-${key}`}>{inputLabel}</label>
            <div className="color-input-container">
              <input
                id={`input-${key}`}
                type="color"
                value={settings[key] || '#000000'}
                onChange={handleChange(key)}
              />
              <div className="color-value">{settings[key] || '#000000'}</div>
            </div>
          </div>
        );
      
      case 'range':
        return (
          <div className="input-group" key={key}>
            <div className="input-label-with-value">
              <label htmlFor={`input-${key}`}>{inputLabel}</label>
              <span className="value-display">{settings[key]}</span>
            </div>
            <input
              id={`input-${key}`}
              type="range"
              min={config.min}
              max={config.max}
              value={settings[key] || 0}
              onChange={handleChange(key)}
            />
          </div>
        );

      case 'number':
        return (
          <div className="input-group" key={key}>
            <label htmlFor={`input-${key}`}>{inputLabel}</label>
            <div className="number-input-container">
              <button 
                type="button" 
                className="number-control"
                onClick={() => decrementNumber(key)}
              >
                -
              </button>
              <input
                id={`input-${key}`}
                type="number"
                value={settings[key] || ''}
                onChange={handleChange(key)}
                min={config.min}
                max={config.max}
              />
              <button 
                type="button" 
                className="number-control"
                onClick={() => incrementNumber(key)}
              >
                +
              </button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="input-group" key={key}>
            <label htmlFor={`input-${key}`}>{inputLabel}</label>
            <input
              id={`input-${key}`}
              type="text"
              value={settings[key] || ''}
              onChange={handleChange(key)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Group related settings
  const groupSettings = (keys) => {
    // Shadow settings should be in their own section
    const shadowKeys = ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur'].filter(key => 
      keys.includes(key)
    );
    
    // Remove shadow keys from the main keys
    const mainKeys = keys.filter(key => !shadowKeys.includes(key));
    
    return (
      <>
        {/* Main settings */}
        <div className="settings-container">
          {mainKeys.map(renderInput)}
        </div>
        
        {/* Shadow settings */}
        {shadowKeys.length > 0 && (
          <div className="settings-section">
            <h2 className="settings-section-title">Shadow</h2>
            <div className="shadow-controls">
              {shadowKeys.map(renderInput)}
            </div>
          </div>
        )}
      </>
    );
  };

  const activeConfig = isBrushActive
    ? { keys: brushConfigs[activeBrush] || [], title: `${activeBrush.charAt(0).toUpperCase() + activeBrush.slice(1)} Brush Settings` }
    : selectedObj
      ? {
          keys: [
            ...(shapeConfigs[selectedObj.type] || []),
            'shadowColor',
            'shadowOffsetX',
            'shadowOffsetY',
            'shadowBlur'
          ],
          title: 'Object Settings'
        }
      : { keys: [], title: 'Settings' };

  return (
    <div className="object-settings">
      <h1>{activeConfig.title}</h1>

      {(selectedObj || isBrushActive) ? (
        <div>
          {groupSettings(activeConfig.keys)}
          
          {selectedObj && (
            <button className="delete-button" onClick={handleDelete}>
             
              Delete Object
            </button>
          )}
          
          {/* Add ImageFilters component when an image is selected */}
          {selectedObj && isImage(selectedObj) && (
            <ImageFilters canvas={canvas} selectedObject={selectedObj} />
          )}
        </div>
      ) : (
        <div className="empty-state">
       
          <p>Select an object or activate a brush to see settings</p>
        </div>
      )}
    </div>
  );
}

export default ToolbarRight;