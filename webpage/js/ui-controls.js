/**
 * UI Controls - toolbar creation and other UI elements
 */

InfiniteGrid.prototype.createToolbar = function() {
    const toolbar = document.getElementById('tile-toolbar');
    
    // Create tiles 0-10
    for (let i = 0; i <= 10; i++) {
        const toolbarTile = document.createElement('div');
        toolbarTile.className = 'toolbar-tile';
        toolbarTile.style.backgroundImage = `url(tiles/${i}.png)`;
        toolbarTile.title = `Click to use tile ${i}`;
        
        // Add number label
        const numberLabel = document.createElement('div');
        numberLabel.className = 'toolbar-tile-number';
        numberLabel.textContent = i;
        toolbarTile.appendChild(numberLabel);
        
        // Click handler to apply tile to active tile
        toolbarTile.addEventListener('click', () => {
            if (this.activeTile) {
                this.applyTileNumber(this.activeTile, i.toString());
            }
        });
        
        toolbar.appendChild(toolbarTile);
    }
};
