import React, { useState, useEffect } from 'react';
import { 
  filterTypes, 
  applyFilter, 
  removeFilter, 
  updateFilterIntensity, 
  clearAllFilters, 
  isImage 
} from '../utils/filterUtils';

function ImageFilters({ canvas, selectedObject }) {
  const [activeFilters, setActiveFilters] = useState({});
  const [isImageSelected, setIsImageSelected] = useState(false);

  // Initialize component when selected object changes
  useEffect(() => {
    setIsImageSelected(selectedObject && isImage(selectedObject));
    
    if (selectedObject && isImage(selectedObject)) {
      // Initialize active filters based on what's already applied
      const currentFilters = {};
      selectedObject.filters?.forEach(filter => {
        if (filter.filterType) {
          const config = filterTypes[filter.filterType];
          currentFilters[filter.filterType] = filter[config.intensityProperty];
        }
      });
      
      setActiveFilters(currentFilters);
    } else {
      setActiveFilters({});
    }
  }, [selectedObject]);

  // No UI needed if no image is selected
  if (!isImageSelected) {
    return null;
  }

  // Toggle filter on/off
  const toggleFilter = (filterType) => {
    if (!selectedObject) return;
    
    const isActive = activeFilters.hasOwnProperty(filterType);
    const config = filterTypes[filterType];
    
    if (isActive) {
      // Remove the filter
      removeFilter(selectedObject, filterType);
      
      // Update state
      const newActiveFilters = { ...activeFilters };
      delete newActiveFilters[filterType];
      setActiveFilters(newActiveFilters);
    } else {
      // Add the filter with default intensity
      applyFilter(selectedObject, filterType, config.defaultValue);
      
      // Update state
      setActiveFilters({
        ...activeFilters,
        [filterType]: config.defaultValue
      });
    }
    
    canvas.requestRenderAll();
  };

  // Update filter intensity
  const handleIntensityChange = (filterType, value) => {
    if (!selectedObject) return;
    
    const intensity = parseFloat(value);
    updateFilterIntensity(selectedObject, filterType, intensity);
    
    setActiveFilters({
      ...activeFilters,
      [filterType]: intensity
    });
    
    canvas.requestRenderAll();
  };

  // Remove all filters
  const handleClearFilters = () => {
    if (!selectedObject) return;
    
    clearAllFilters(selectedObject);
    setActiveFilters({});
    canvas.requestRenderAll();
  };

  return (
    <div className="image-filters">
      <h3>Image Filters</h3>
      
      <div className="filter-buttons">
        {Object.keys(filterTypes).map(filterType => {
          const isActive = activeFilters.hasOwnProperty(filterType);
          const config = filterTypes[filterType];
          
          return (
            <div key={filterType} className="filter-item">
              <button 
                className={`filter-toggle ${isActive ? 'active' : ''}`}
                onClick={() => toggleFilter(filterType)}
              >
                {config.name}
              </button>
              
              {isActive && (
                <div className="intensity-slider">
                  <input
                    type="range"
                    min={config.minValue || 0}
                    max={config.maxValue || 1}
                    step={0.05}
                    value={activeFilters[filterType]}
                    onChange={(e) => handleIntensityChange(filterType, e.target.value)}
                  />
                  <span>{Math.round(activeFilters[filterType] * 100) / 100}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {Object.keys(activeFilters).length > 0 && (
        <button className="clear-filters" onClick={handleClearFilters}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default ImageFilters;