import React from 'react';

const CraftingGrid = ({ currentGrid, onDropItem, onSlotClick }) => {
  
  const handleDragOver = (e) => {
    // CRUCIAL: By default, dropping is not allowed in the browser. 
    // Browser needs to know that it's okay to drop items, so we call preventDefault() on the dragover event. 
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    // Get the item ID from the dataTransfer object
    const itemId = e.dataTransfer.getData('itemId');
    
    if (itemId) {
      // Send it up to App.js
      onDropItem(itemId, index);
    }
  };

  return (
    <div className="crafting-grid">
      {currentGrid.map((item, index) => (
        <div 
          key={index} 
          className="grid-cell" 
          data-slot={index}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onClick={() => onSlotClick(index)} // Clicks to REMOVE items (TO DO: Create tip in UI)
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' 
          }}
        >
          {item && (
            <div className="crafted-item" title={item.name}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CraftingGrid;