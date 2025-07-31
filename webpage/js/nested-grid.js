/**
 * Nested grid functionality - entering and exiting nested grids
 */

InfiniteGrid.prototype.enterNestedGrid = function(tileX, tileY) {
    // Add to level stack
    this.levelStack.push(`${tileX},${tileY}`);
    this.currentLevel++;
    
    // Reset zoom and position for the new level
    this.zoomLevel = 1;
    this.offsetX = this.viewportWidth / 2 - this.baseTileSize / 2;
    this.offsetY = this.viewportHeight / 2 - this.baseTileSize / 2;
    
    console.log(`Entered nested grid at level ${this.currentLevel}, tile (${tileX}, ${tileY})`);
    this.updateGrid();
    this.updateLevelIndicator();
    this.showNestedControls();
};

InfiniteGrid.prototype.exitNestedGrid = function() {
    if (this.currentLevel === 0) return;
    
    // Get the current nested grid data before exiting
    const currentPath = this.getCurrentPath();
    const currentTileData = this.getCurrentTileData();
    
    // Pop from level stack to get parent tile coordinates
    const parentTileCoords = this.levelStack.pop();
    this.currentLevel--;
    
    // Generate mini representation of the nested grid
    if (currentTileData.size > 0) {
        this.generateMiniRepresentation(parentTileCoords, currentTileData);
    } else {
        // Even if there's no content, make sure the parent level is updated
        this.updateGrid();
    }
    
    // Reset zoom and center grid
    this.zoomLevel = 1;
    this.centerGrid();
    
    console.log(`Exited to level ${this.currentLevel}`);
    this.updateLevelIndicator();
    
    if (this.currentLevel === 0) {
        this.hideNestedControls();
    }
};

InfiniteGrid.prototype.showNestedControls = function() {
    // Create nested controls container if it doesn't exist
    let nestedControls = document.getElementById('nested-controls');
    if (!nestedControls) {
        nestedControls = document.createElement('div');
        nestedControls.id = 'nested-controls';
        nestedControls.innerHTML = `
            <div class="nested-controls-content">
                <label for="grid-size-slider">Grid Size: <span id="grid-size-value">${this.currentGridSize}x${this.currentGridSize}</span></label>
                <input type="range" id="grid-size-slider" min="2" max="20" value="${this.currentGridSize}">
                <button id="exit-tile-btn">Exit Tile</button>
            </div>
        `;
        document.body.appendChild(nestedControls);
        
        // Add event listeners
        const slider = document.getElementById('grid-size-slider');
        const sizeValue = document.getElementById('grid-size-value');
        const exitBtn = document.getElementById('exit-tile-btn');
        
        slider.addEventListener('input', (e) => {
            this.currentGridSize = parseInt(e.target.value);
            sizeValue.textContent = `${this.currentGridSize}x${this.currentGridSize}`;
            this.updateGrid(); // Refresh grid with new dimensions
        });
        
        exitBtn.addEventListener('click', () => {
            this.exitNestedGrid();
        });
    }
    nestedControls.style.display = 'block';
};

InfiniteGrid.prototype.hideNestedControls = function() {
    const nestedControls = document.getElementById('nested-controls');
    if (nestedControls) {
        nestedControls.style.display = 'none';
    }
};

InfiniteGrid.prototype.updateLevelIndicator = function() {
    const indicator = document.getElementById('level-indicator');
    const path = this.getCurrentPath();
    indicator.innerHTML = `Level: ${this.currentLevel}<br>Path: ${path === 'root' ? 'Root' : path}`;
};
