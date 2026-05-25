import React from 'react';

// Main list
export const MINECRAFT_ITEMS = [
  // Default Building & Crafting Materials
  { id: 'oak_planks', name: 'Oak Planks', image: '/images/Oak_planks.png' },
  { id: 'stick', name: 'Stick', image: '/images/Stick.png' },
  { id: 'cobblestone', name: 'Cobblestone', image: '/images/Cobblestone.png' },
  
  // Ores & Minerals
  { id: 'coal', name: 'Coal', image: '/images/Coal.png' },
  { id: 'iron_ingot', name: 'Iron Ingot', image: '/images/Iron_Ingot.png' },
  { id: 'gold_ingot', name: 'Gold Ingot', image: '/images/Gold_Ingot.png' },
  { id: 'diamond', name: 'Diamond', image: '/images/Diamond.png' },
  { id: 'emerald', name: 'Emerald', image: '/images/Emerald.png' },
  { id: 'redstone', name: 'Redstone Dust', image: '/images/Redstone.png' },
  { id: 'lapis_lazuli', name: 'Lapis Lazuli', image: '/images/Lapis_Lazuli.png' },
  
  // Mob Drops & Foraging
  { id: 'string', name: 'String', image: '/images/String.png' },
  { id: 'gunpowder', name: 'Gunpowder', image: '/images/Gunpowder.png' },
  { id: 'bone', name: 'Bone', image: '/images/Bone.png' },
  { id: 'slime_ball', name: 'Slimeball', image: '/images/Slimeball.png' },
  { id: 'feather', name: 'Feather', image: '/images/Feather.png' },
  { id: 'leather', name: 'Leather', image: '/images/Leather.png' },
  { id: 'flint', name: 'Flint', image: '/images/Flint.png' },
  
  // Advanced / Magic
  { id: 'blaze_rod', name: 'Blaze Rod', image: '/images/Blaze_Rod.png' },
  { id: 'ender_pearl', name: 'Ender Pearl', image: '/images/Ender_Pearl.png' },
  { id: 'obsidian', name: 'Obsidian', image: '/images/Obsidian.png' }
];

const InventoryGrid = () => {
  const handleDragStart = (e, item) => {
    // Store the item ID in the dataTransfer object so it can be retrieved on drop
    e.dataTransfer.setData('itemId', item.id);
    
    // Tell the browser we are "copying" the item, not moving it
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(5, 1fr)', 
      gap: '8px',
      maxWidth: '400px',
      backgroundColor: '#0a0a0a6b',
      padding: '16px',
      borderRadius: '15px',
      border: '1px solid #222'
    }}>
      {MINECRAFT_ITEMS.map(item => (
        <div 
          key={item.id}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, item)}
          title={item.name}
          style={{
            cursor: 'grab',
            backgroundColor: '#151515be',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #333'
          }}
        >
          <img 
            src={item.image} 
            alt={item.name} 
            style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} 
            draggable={false} // Prevents the browser's default "ghost image" dragging behavior 
          />
        </div>
      ))}
    </div>
  );
};

export default InventoryGrid;