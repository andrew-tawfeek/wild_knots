/**
 * Core InfiniteGrid class - handles the main grid functionality
 */
class InfiniteGrid {
    constructor() {
        this.gridContainer = document.getElementById('grid-container');
        this.grid = document.getElementById('grid');
        this.baseTileSize = 61; // Base tile size (60px + 1px gap)
        this.zoomLevel = 1; // Current zoom level
        this.minZoom = 0.2; // Minimum zoom level
        this.maxZoom = 5; // Maximum zoom level
        this.visibleTiles = new Map();
        this.activeTile = null;
        this.selectedTiles = new Set(); // For multi-selection
        this.copiedTiles = []; // For copy/paste functionality
        this.tileData = new Map(); // Store tile states
        
        // Hierarchical grid system
        this.currentLevel = 0; // 0 = root level, 1+ = nested levels
        this.levelStack = []; // Stack of parent coordinates when diving into nested grids
        this.nestedGridData = new Map(); // Store nested grid data by path
        this.currentGridSize = 10; // Current grid dimensions (10x10 default)
        
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        
        // Initial grid position
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.isDragging = false;
        this.dragStarted = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.dragThreshold = 5; // Minimum distance to consider it a drag
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createToolbar();
        this.updateGrid();
        this.centerGrid();
    }
    
    updateGrid() {
        // Calculate current tile size based on zoom
        const currentTileSize = this.baseTileSize * this.zoomLevel;
        
        let startX, endX, startY, endY;
        
        if (this.currentLevel > 0) {
            // In nested mode, show grid based on currentGridSize
            const halfSize = Math.floor(this.currentGridSize / 2);
            startX = -halfSize;
            endX = halfSize;
            startY = -halfSize;
            endY = halfSize;
        } else {
            // Calculate visible tile range for infinite grid
            startX = Math.floor(-this.offsetX / currentTileSize) - 2;
            endX = Math.floor((-this.offsetX + this.viewportWidth) / currentTileSize) + 2;
            startY = Math.floor(-this.offsetY / currentTileSize) - 2;
            endY = Math.floor((-this.offsetY + this.viewportHeight) / currentTileSize) + 2;
        }
        
        // Clear existing tiles
        this.grid.innerHTML = '';
        this.visibleTiles.clear();
        
        // Set grid position
        this.grid.style.left = this.offsetX + 'px';
        this.grid.style.top = this.offsetY + 'px';
        this.grid.style.transform = `scale(${this.zoomLevel})`;
        this.grid.style.transformOrigin = '0 0';
        
        // Create visible tiles
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                this.createTile(x, y);
            }
        }
        
        // Update zoom display
        this.updateZoomDisplay();
    }
    
    createTile(gridX, gridY) {
        const tileKey = `${gridX},${gridY}`;
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.gridX = gridX;
        tile.dataset.gridY = gridY;
        
        // Position the tile
        tile.style.position = 'absolute';
        tile.style.left = (gridX * this.baseTileSize) + 'px';
        tile.style.top = (gridY * this.baseTileSize) + 'px';
        
        // Add coordinate label
        const label = document.createElement('div');
        label.className = 'tile-number';
        label.textContent = `${gridX},${gridY}`;
        tile.appendChild(label);
        
        // Apply saved tile data if exists
        const currentPath = this.getCurrentPath();
        const tileDataMap = this.getCurrentTileData();
        
        if (tileDataMap.has(tileKey)) {
            const tileInfo = tileDataMap.get(tileKey);
            
            if (tileInfo.miniRepresentation) {
                // Use mini representation as background
                tile.style.backgroundImage = `url(${tileInfo.miniRepresentation})`;
                tile.style.backgroundSize = 'cover';
                tile.style.backgroundPosition = 'center';
                tile.classList.add('has-nested');
                
                // Add nested indicator for mini representations
                const nestedIndicator = document.createElement('div');
                nestedIndicator.className = 'nested-indicator';
                nestedIndicator.textContent = '⊞';
                tile.appendChild(nestedIndicator);
                
                console.log(`Displaying mini representation for tile (${gridX}, ${gridY})`);
            } else if (tileInfo.number === -1) {
                tile.classList.add('black-tile');
            } else if (tileInfo.number !== null && tileInfo.number !== undefined) {
                tile.style.backgroundImage = `url(tiles/${tileInfo.number}.png)`;
                tile.style.backgroundSize = 'cover';
                tile.style.backgroundPosition = 'center';
            }
        } else {
            // Check if this tile has nested content (but no mini representation yet)
            if (this.hasNestedContent(gridX, gridY)) {
                tile.classList.add('has-nested');
                const nestedIndicator = document.createElement('div');
                nestedIndicator.className = 'nested-indicator';
                nestedIndicator.textContent = '⊞';
                tile.appendChild(nestedIndicator);
            }
        }
        
        // Check if tile is selected
        if (this.selectedTiles.has(tileKey)) {
            tile.classList.add('selected');
        }
        
        // Click event - handle single click and double click
        tile.addEventListener('click', (e) => {
            e.stopPropagation();
            // Only process click if we haven't actually dragged
            if (!this.dragStarted) {
                if (e.shiftKey) {
                    this.toggleTileSelection(tile);
                } else {
                    // Single click to edit
                    this.selectTile(tile);
                }
            }
        });
        
        // Double-click event to enter nested grid
        tile.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (!this.dragStarted) {
                const gridX = parseInt(tile.dataset.gridX);
                const gridY = parseInt(tile.dataset.gridY);
                this.enterNestedGrid(gridX, gridY);
            }
        });
        
        this.grid.appendChild(tile);
        this.visibleTiles.set(tileKey, tile);
    }
    
    getCurrentPath() {
        return this.levelStack.join('/') || 'root';
    }
    
    getCurrentTileData() {
        const path = this.getCurrentPath();
        if (!this.nestedGridData.has(path)) {
            this.nestedGridData.set(path, new Map());
        }
        return this.nestedGridData.get(path);
    }
    
    hasNestedContent(gridX, gridY) {
        const nestedPath = `${this.getCurrentPath()}/${gridX},${gridY}`;
        const hasActualNested = this.nestedGridData.has(nestedPath) && this.nestedGridData.get(nestedPath).size > 0;
        
        // Also check if tile has mini representation
        const tileKey = `${gridX},${gridY}`;
        const currentTileData = this.getCurrentTileData();
        const tileInfo = currentTileData.get(tileKey);
        const hasMiniRep = tileInfo && (tileInfo.hasNestedContent || tileInfo.miniRepresentation);
        
        return hasActualNested || hasMiniRep;
    }
    
    centerGrid() {
        this.offsetX = this.viewportWidth / 2 - (this.baseTileSize * this.zoomLevel) / 2;
        this.offsetY = this.viewportHeight / 2 - (this.baseTileSize * this.zoomLevel) / 2;
        this.updateGrid();
    }
    
    updateZoomDisplay() {
        // Update zoom indicator in controls
        let zoomDisplay = document.getElementById('zoom-display');
        if (!zoomDisplay) {
            zoomDisplay = document.createElement('div');
            zoomDisplay.id = 'zoom-display';
            zoomDisplay.style.fontSize = '12px';
            zoomDisplay.style.color = '#666';
            zoomDisplay.style.marginTop = '5px';
            document.getElementById('controls').appendChild(zoomDisplay);
        }
        const zoomText = `Zoom: ${Math.round(this.zoomLevel * 100)}%`;
        const levelText = this.currentLevel > 0 ? ` (Level ${this.currentLevel})` : '';
        zoomDisplay.textContent = zoomText + levelText;
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.updateGrid();
    }
    
    reset() {
        this.tileData.clear();
        this.nestedGridData.clear();
        this.selectedTiles.clear();
        this.copiedTiles = [];
        this.currentLevel = 0;
        this.levelStack = [];
        this.currentGridSize = 10;
        this.zoomLevel = 1;
        this.hideNestedControls();
        this.updateGrid();
        this.updateLevelIndicator();
    }
}
