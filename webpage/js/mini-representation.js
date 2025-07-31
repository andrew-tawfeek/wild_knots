/**
 * Mini representation generation for nested grids
 */

InfiniteGrid.prototype.generateMiniRepresentation = function(parentTileCoords, nestedData) {
    // Calculate bounding box of all tiles in the nested grid (including empty ones)
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    // Include all tiles in the current grid size, not just the ones with data
    const halfSize = Math.floor(this.currentGridSize / 2);
    minX = -halfSize;
    maxX = halfSize;
    minY = -halfSize;
    maxY = halfSize;
    
    // Calculate dimensions
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const maxDim = Math.max(width, height);
    
    console.log(`Creating mini representation: ${width}x${height} grid (${nestedData.size} non-empty tiles)`);
    
    // Create high-resolution canvas for mini representation
    const scaleFactor = 4; // 4x resolution for high quality
    const baseCanvasSize = 58; // Base size (slightly smaller than tile 60px to leave border)
    const canvas = document.createElement('canvas');
    const canvasSize = baseCanvasSize * scaleFactor;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    
    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Fill background with light color
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Calculate cell size for mini grid (ensure minimum size with high resolution)
    const cellSize = Math.max(8, Math.floor((canvasSize - 16) / maxDim)); // Leave 8px margin (2px at base resolution)
    const gridWidth = width * cellSize;
    const gridHeight = height * cellSize;
    const startX = (canvasSize - gridWidth) / 2;
    const startY = (canvasSize - gridHeight) / 2;
    
    // Load and draw tile images with high resolution
    this.loadTileImagesForMini(canvas, ctx, nestedData, minX, maxX, minY, maxY, cellSize, startX, startY, parentTileCoords, scaleFactor, baseCanvasSize);
};

InfiniteGrid.prototype.loadTileImagesForMini = function(canvas, ctx, nestedData, minX, maxX, minY, maxY, cellSize, startX, startY, parentTileCoords, scaleFactor, baseCanvasSize) {
    const imagesToLoad = new Map();
    let loadedCount = 0;
    let totalImages = 0;
    
    // Determine which images we need to load
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const tileKey = `${x},${y}`;
            const tileInfo = nestedData.get(tileKey);
            
            // Use tile number if it exists, otherwise default to 0 (empty tile = 0.png)
            const tileNumber = (tileInfo && tileInfo.number !== null && tileInfo.number !== undefined) ? tileInfo.number : 0;
            
            if (!imagesToLoad.has(tileNumber)) {
                imagesToLoad.set(tileNumber, new Image());
                totalImages++;
            }
        }
    }
    
    // Load all unique images
    imagesToLoad.forEach((img, tileNumber) => {
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                this.drawMiniGrid(canvas, ctx, nestedData, minX, maxX, minY, maxY, cellSize, startX, startY, imagesToLoad, parentTileCoords, scaleFactor, baseCanvasSize);
            }
        };
        
        img.onerror = () => {
            console.warn(`Failed to load tile image: tiles/${tileNumber}.png`);
            loadedCount++;
            if (loadedCount === totalImages) {
                this.drawMiniGrid(canvas, ctx, nestedData, minX, maxX, minY, maxY, cellSize, startX, startY, imagesToLoad, parentTileCoords, scaleFactor, baseCanvasSize);
            }
        };
        
        img.src = `tiles/${tileNumber}.png`;
    });
};

InfiniteGrid.prototype.drawMiniGrid = function(canvas, ctx, nestedData, minX, maxX, minY, maxY, cellSize, startX, startY, imagesToLoad, parentTileCoords, scaleFactor, baseCanvasSize) {
    console.log(`Drawing high-quality mini grid: ${maxX - minX + 1}x${maxY - minY + 1}, cellSize: ${cellSize}, scaleFactor: ${scaleFactor}`);
    
    // Set high-quality rendering context
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw each tile in the grid
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const tileKey = `${x},${y}`;
            const tileInfo = nestedData.get(tileKey);
            
            // Use tile number if it exists, otherwise default to 0 (empty tile = 0.png)
            const tileNumber = (tileInfo && tileInfo.number !== null && tileInfo.number !== undefined) ? tileInfo.number : 0;
            
            const relativeX = x - minX;
            const relativeY = y - minY;
            
            const pixelX = startX + relativeX * cellSize;
            const pixelY = startY + relativeY * cellSize;
            
            // Draw the tile image if it loaded successfully with high quality
            const img = imagesToLoad.get(tileNumber);
            if (img && img.complete && img.naturalHeight !== 0) {
                // Use high-quality image scaling
                ctx.drawImage(img, Math.floor(pixelX), Math.floor(pixelY), cellSize - scaleFactor, cellSize - scaleFactor);
            } else {
                // Fallback to color if image failed to load
                ctx.fillStyle = this.getTileColor(tileNumber);
                ctx.fillRect(Math.floor(pixelX), Math.floor(pixelY), cellSize - scaleFactor, cellSize - scaleFactor);
            }
            
            // Add subtle border for visibility (scaled up)
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = scaleFactor * 0.25;
            ctx.strokeRect(Math.floor(pixelX), Math.floor(pixelY), cellSize - scaleFactor, cellSize - scaleFactor);
        }
    }
    
    // Add a border around the entire mini grid (scaled up)
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = scaleFactor;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Convert canvas to high-quality PNG data URL
    const dataURL = canvas.toDataURL('image/png', 1.0); // Maximum quality PNG
    
    // Store the mini representation in the PARENT level's tile data
    const [parentX, parentY] = parentTileCoords.split(',').map(Number);
    const parentKey = `${parentX},${parentY}`;
    const parentTileData = this.getCurrentTileData(); // This is now the parent level since we already decremented
    
    // Set a special marker to indicate this tile has nested content with mini representation
    parentTileData.set(parentKey, { 
        number: null, 
        miniRepresentation: dataURL,
        hasNestedContent: true 
    });
    
    console.log(`Generated high-quality mini representation for tile (${parentX}, ${parentY}) at level ${this.currentLevel}, data URL length:`, dataURL.length);
    
    // Refresh the grid to show the new mini representation
    this.updateGrid();
};

InfiniteGrid.prototype.getTileColor = function(number) {
    // Return appropriate colors for different tile numbers
    const colors = {
        '-1': '#000000',  // Black tile
        '0': '#ffffff',   // White
        '1': '#ff6b6b',   // Red
        '2': '#4ecdc4',   // Teal
        '3': '#45b7d1',   // Blue
        '4': '#96ceb4',   // Green
        '5': '#ffeaa7',   // Yellow
        '6': '#dda0dd',   // Plum
        '7': '#98d8c8',   // Mint
        '8': '#f7dc6f',   // Light yellow
        '9': '#bb8fce',   // Light purple
        '10': '#85c1e9'   // Light blue
    };
    return colors[number.toString()] || '#e9ecef'; // Default gray
};
