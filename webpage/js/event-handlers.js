/**
 * Event handlers for the infinite grid
 */

// Extend the InfiniteGrid class with event handling methods
InfiniteGrid.prototype.setupEventListeners = function() {
    // Mouse events for dragging
    this.gridContainer.addEventListener('mousedown', (e) => {
        if (e.target === this.gridContainer || e.target === this.grid || e.target.classList.contains('tile')) {
            this.isDragging = true;
            this.dragStarted = false; // Only set to true when actual dragging occurs
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Only start dragging if we've moved beyond the threshold
            if (!this.dragStarted && distance > this.dragThreshold) {
                this.dragStarted = true;
                this.gridContainer.style.cursor = 'grabbing';
            }
            
            if (this.dragStarted) {
                this.offsetX += deltaX;
                this.offsetY += deltaY;
                this.updateGrid();
            }
            
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragStarted = false;
            this.gridContainer.style.cursor = 'grab';
        }
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.updateGrid();
    });
    
    // Scroll wheel for zooming (normal zoom functionality only)
    this.gridContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = this.gridContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate zoom factor
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel * zoomFactor));
        
        if (newZoom !== this.zoomLevel) {
            // Calculate zoom point relative to current view
            const worldX = (mouseX - this.offsetX) / this.zoomLevel;
            const worldY = (mouseY - this.offsetY) / this.zoomLevel;
            
            // Update zoom level
            this.zoomLevel = newZoom;
            
            // Adjust offset to keep the zoom point centered
            this.offsetX = mouseX - worldX * this.zoomLevel;
            this.offsetY = mouseY - worldY * this.zoomLevel;
            
            this.updateGrid();
        }
    });
    
    // Touch events for mobile support
    this.setupTouchEvents();
    
    // Keyboard events for copy/paste and number input
    this.setupKeyboardEvents();
};

InfiniteGrid.prototype.setupTouchEvents = function() {
    let touchStartDistance = 0;
    let touchStartZoom = 1;
    
    this.gridContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Two-finger pinch for zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            touchStartDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            touchStartZoom = this.zoomLevel;
        } else if (e.touches.length === 1) {
            // Single finger for drag
            this.isDragging = true;
            this.lastMouseX = e.touches[0].clientX;
            this.lastMouseY = e.touches[0].clientY;
        }
        e.preventDefault();
    });
    
    this.gridContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            // Handle pinch zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (touchStartDistance > 0) {
                const scale = currentDistance / touchStartDistance;
                const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, touchStartZoom * scale));
                this.zoomLevel = newZoom;
                this.updateGrid();
            }
        } else if (e.touches.length === 1 && this.isDragging) {
            // Handle drag
            const deltaX = e.touches[0].clientX - this.lastMouseX;
            const deltaY = e.touches[0].clientY - this.lastMouseY;
            
            this.offsetX += deltaX;
            this.offsetY += deltaY;
            
            this.updateGrid();
            
            this.lastMouseX = e.touches[0].clientX;
            this.lastMouseY = e.touches[0].clientY;
        }
        e.preventDefault();
    });
    
    this.gridContainer.addEventListener('touchend', (e) => {
        this.isDragging = false;
        touchStartDistance = 0;
        e.preventDefault();
    });
};

InfiniteGrid.prototype.setupKeyboardEvents = function() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'c' || e.key === 'C') {
                e.preventDefault();
                this.copySelectedTiles();
            } else if (e.key === 'v' || e.key === 'V') {
                e.preventDefault();
                this.pasteSelectedTiles();
            }
        } else if (e.key === 'Escape') {
            this.clearSelection();
            this.deselectTile();
        } else if (this.activeTile && !e.target.classList.contains('tile-input')) {
            // Handle direct number input when a tile is active
            this.handleDirectNumberInput(e);
        }
    });
};

InfiniteGrid.prototype.handleDirectNumberInput = function(e) {
    if (!this.activeTile) return;
    
    // Handle direct number key presses
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        this.applyTileNumber(this.activeTile, e.key);
    } else if (e.key === '-') {
        e.preventDefault();
        // Start input field with minus sign for -1
        this.showInputField(this.activeTile, '-');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        // Clear the tile from current level
        const tileKey = `${this.activeTile.dataset.gridX},${this.activeTile.dataset.gridY}`;
        const currentTileData = this.getCurrentTileData();
        currentTileData.delete(tileKey);
        this.activeTile.classList.remove('black-tile');
        this.activeTile.classList.remove('has-nested');
        this.activeTile.style.backgroundImage = '';
        
        // Remove nested indicator if present
        const indicator = this.activeTile.querySelector('.nested-indicator');
        if (indicator) indicator.remove();
        
        console.log(`Cleared tile at position (${this.activeTile.dataset.gridX}, ${this.activeTile.dataset.gridY}) on level ${this.currentLevel}`);
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        // Show input field for manual entry
        this.showInputField(this.activeTile);
    }
};
