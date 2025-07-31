/**
 * Main initialization and global functions
 */

// Global variable for the grid instance
let grid;

// Initialize the grid when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    grid = new InfiniteGrid();
    
    // Initialize level indicator
    grid.updateLevelIndicator();
    
    // Handle clicks outside tiles to deselect
    document.addEventListener('click', (e) => {
        // Only deselect if clicking on the background or grid container
        if (e.target === grid.gridContainer || e.target === grid.grid) {
            grid.deselectTile();
        }
    });
});

// Global functions for buttons
function resetGrid() {
    if (grid) {
        grid.reset();
    }
}

function centerGrid() {
    if (grid) {
        grid.centerGrid();
    }
}

function resetZoom() {
    if (grid) {
        grid.resetZoom();
    }
}

function clearSelection() {
    if (grid) {
        grid.clearSelection();
    }
}
