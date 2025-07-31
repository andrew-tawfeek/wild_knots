/**
 * Tile operations - selection, copying, pasting, and visual application
 */

InfiniteGrid.prototype.selectTile = function(tile) {
    // Clear previous selections when not multi-selecting
    this.clearSelection();
    
    // Remove active class from previous tile
    if (this.activeTile) {
        this.activeTile.classList.remove('active');
        const input = this.activeTile.querySelector('.tile-input');
        if (input) {
            input.remove();
        }
    }

    // Set new active tile
    this.activeTile = tile;
    tile.classList.add('active');
    
    // Don't automatically create input field - wait for user action
};

InfiniteGrid.prototype.showInputField = function(tile, initialValue = '') {
    // Create input field only when needed
    const input = document.createElement('input');
    input.className = 'tile-input';
    input.type = 'text';
    input.placeholder = '-1 to 10';
    input.maxLength = 3;
    input.value = initialValue;

    // Input event handlers
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            this.applyTileNumber(tile, input.value);
        } else if (e.key === 'Escape') {
            this.deselectTile();
        }
    });

    input.addEventListener('blur', () => {
        // Submit the value when clicking away
        setTimeout(() => {
            if (input.value.trim() !== '') {
                this.applyTileNumber(tile, input.value);
            } else {
                this.deselectTile();
            }
        }, 100);
    });

    // Allow numbers including negative
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9-]/g, '');
        
        // Ensure only one minus sign at the beginning
        const minusCount = (value.match(/-/g) || []).length;
        if (minusCount > 1) {
            value = value.replace(/-/g, '');
            if (e.target.value.startsWith('-')) {
                value = '-' + value;
            }
        }
        
        // Move minus to front if it exists
        if (value.includes('-') && !value.startsWith('-')) {
            value = '-' + value.replace('-', '');
        }
        
        const num = parseInt(value);
        if (value && !isNaN(num) && (num < -1 || num > 10)) {
            e.target.value = e.target.value.slice(0, -1);
        } else {
            e.target.value = value;
        }
    });

    tile.appendChild(input);
    input.focus();
    input.select(); // Select all text for easy replacement
};

InfiniteGrid.prototype.toggleTileSelection = function(tile) {
    const tileKey = `${tile.dataset.gridX},${tile.dataset.gridY}`;
    
    if (this.selectedTiles.has(tileKey)) {
        this.selectedTiles.delete(tileKey);
        tile.classList.remove('selected');
    } else {
        this.selectedTiles.add(tileKey);
        tile.classList.add('selected');
    }
};

InfiniteGrid.prototype.clearSelection = function() {
    // Remove selected class from all visible tiles
    this.selectedTiles.forEach(tileKey => {
        if (this.visibleTiles.has(tileKey)) {
            this.visibleTiles.get(tileKey).classList.remove('selected');
        }
    });
    this.selectedTiles.clear();
};

InfiniteGrid.prototype.copySelectedTiles = function() {
    if (this.selectedTiles.size === 0) {
        console.log('No tiles selected to copy');
        return;
    }
    
    this.copiedTiles = [];
    let minX = Infinity, minY = Infinity;
    
    // Find the minimum coordinates to normalize the pattern
    this.selectedTiles.forEach(tileKey => {
        const [x, y] = tileKey.split(',').map(Number);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
    });
    
    // Store relative positions and tile data from current level
    const currentTileData = this.getCurrentTileData();
    this.selectedTiles.forEach(tileKey => {
        const [x, y] = tileKey.split(',').map(Number);
        const tileData = currentTileData.get(tileKey);
        this.copiedTiles.push({
            relativeX: x - minX,
            relativeY: y - minY,
            number: tileData ? tileData.number : null,
            miniRepresentation: tileData ? tileData.miniRepresentation : null,
            hasNestedContent: tileData ? tileData.hasNestedContent : false
        });
    });
    
    console.log(`Copied ${this.copiedTiles.length} tiles from level ${this.currentLevel}`);
};

InfiniteGrid.prototype.pasteSelectedTiles = function() {
    if (this.copiedTiles.length === 0) {
        console.log('No tiles to paste');
        return;
    }
    
    if (!this.activeTile) {
        console.log('No active tile selected for pasting');
        return;
    }
    
    const baseX = parseInt(this.activeTile.dataset.gridX);
    const baseY = parseInt(this.activeTile.dataset.gridY);
    const currentTileData = this.getCurrentTileData();
    
    // Apply copied pattern starting from the active tile
    this.copiedTiles.forEach(copiedTile => {
        if (copiedTile.number !== null || copiedTile.miniRepresentation) {
            const targetX = baseX + copiedTile.relativeX;
            const targetY = baseY + copiedTile.relativeY;
            const targetKey = `${targetX},${targetY}`;
            
            // Save tile data to current level
            currentTileData.set(targetKey, { 
                number: copiedTile.number,
                miniRepresentation: copiedTile.miniRepresentation,
                hasNestedContent: copiedTile.hasNestedContent
            });
            
            // Update visible tile if it exists
            if (this.visibleTiles.has(targetKey)) {
                const targetTile = this.visibleTiles.get(targetKey);
                if (copiedTile.miniRepresentation) {
                    targetTile.style.backgroundImage = `url(${copiedTile.miniRepresentation})`;
                    targetTile.style.backgroundSize = 'cover';
                    targetTile.style.backgroundPosition = 'center';
                    targetTile.classList.add('has-nested');
                } else if (copiedTile.number !== null) {
                    this.applyTileVisual(targetTile, copiedTile.number);
                }
            }
        }
    });
    
    console.log(`Pasted ${this.copiedTiles.length} tiles starting at (${baseX}, ${baseY}) on level ${this.currentLevel}`);
};

InfiniteGrid.prototype.applyTileVisual = function(tile, number) {
    // Remove any existing visual classes
    tile.classList.remove('black-tile');
    tile.classList.remove('has-nested');
    
    // Remove nested indicator if present
    const indicator = tile.querySelector('.nested-indicator');
    if (indicator) indicator.remove();
    
    if (number === -1) {
        tile.classList.add('black-tile');
        tile.style.backgroundImage = '';
    } else {
        tile.style.backgroundImage = `url(tiles/${number}.png)`;
        tile.style.backgroundSize = 'cover';
        tile.style.backgroundPosition = 'center';
    }
};

InfiniteGrid.prototype.applyTileNumber = function(tile, numberStr) {
    const number = parseInt(numberStr);
    if (!isNaN(number) && number >= -1 && number <= 10) {
        const gridX = parseInt(tile.dataset.gridX);
        const gridY = parseInt(tile.dataset.gridY);
        const tileKey = `${gridX},${gridY}`;
        
        // Save tile data to current level (clear any mini representation)
        const tileDataMap = this.getCurrentTileData();
        tileDataMap.set(tileKey, { 
            number: number,
            miniRepresentation: null,
            hasNestedContent: false
        });
        
        // Apply visual changes
        this.applyTileVisual(tile, number);
        
        console.log(`Applied tile ${number} to position (${gridX}, ${gridY}) at level ${this.currentLevel}`);
    }
    
    this.deselectTile();
};

InfiniteGrid.prototype.deselectTile = function() {
    if (this.activeTile) {
        this.activeTile.classList.remove('active');
        const input = this.activeTile.querySelector('.tile-input');
        if (input) {
            input.remove();
        }
        this.activeTile = null;
    }
};
