# Tiles from https://www.geneseo.edu/knotmosaics

from PIL import Image

# Below are various matrices imported from MosaicMaker for convience

# Problematic: code has trouble with this numbering scheme (unless all these are MEANT to be the unknot?!)


m4_12 = [[0,  2,  1,  0],
        [2, -1, -1,  1],
        [3, -1, -1,  1],
        [0,  3,  4,  0]]
m5_17 = [[0,  2,  1,  0,  0],
        [2, -1, -1,  1,  0],
        [3, -1, -1, -1,  1],
        [0,  3, -1, -1,  4],
        [0,  0,  3,  4,  0]]
m6_22 = [[0,  2,  1,  0,  0,  0],
        [2, -1, -1,  1,  0,  0],
        [3, -1, -1, -1,  1,  0],
        [0,  3, -1, -1, -1,  1],
        [0,  0,  3, -1, -1,  4],
        [0,  0,  0,  3,  4,  0]]
m6_24 = [[0,  0,  2,  1,  0,  0],
        [0,  2, -1, -1,  1,  0],
        [2, -1, -1, -1, -1,  1],
        [3, -1, -1, -1, -1,  4],
        [0,  3, -1, -1,  4,  0],
        [0,  0,  3,  4,  0,  0]]
m6_27 = [[0,  2,  1,  2,  1,  0],
        [2, -1, -1, -1, -1,  1],
        [3, -1, -1, -1, -1,  4],
        [0,  3, -1, -1, -1,  1],
        [0,  0,  3, -1, -1,  4],
        [0,  0,  0,  3,  4,  0]]
m6_32 = [[0,  2,  1,  2,  1,  0],
        [2, -1, -1, -1, -1,  1],
        [3, -1, -1, -1, -1,  4],
        [2, -1, -1, -1, -1,  1],
        [3, -1, -1, -1, -1,  4],
        [0,  3,  4,  3,  4,  0]]
m7_27 = [[0,  2,  1,  0,  0,  0,  0],
        [2, -1, -1,  1,  0,  0,  0],
        [3, -1, -1, -1,  1,  0,  0],
        [0,  3, -1, -1, -1,  1,  0],
        [0,  0,  3, -1, -1, -1,  1],
        [0,  0,  0,  3, -1, -1,  4],
        [0,  0,  0,  0,  3,  4,  0]]
m7_29 = [[0,  2,  1,  0,  0,  0,  0],
        [2, -1, -1,  1,  0,  0,  0],
        [3, -1, -1, -1,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1,  4,  0],
        [0,  3, -1, -1,  4,  0,  0],
        [0,  0,  3,  4,  0,  0,  0]]
m7_31 = [[0,  0,  2,  1,  0,  0,  0],
        [0,  2, -1, -1,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [0,  3, -1, -1, -1, -1,  4],
        [0,  0,  3, -1, -1,  4,  0],
        [0,  0,  0,  3,  4,  0,  0]]
m7_32 = [[0,  2,  1,  0,  0,  0,  0],
        [2, -1, -1,  1,  0,  0,  0],
        [3, -1, -1, -1,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [0,  3,  4,  3, -1, -1,  4],
        [0,  0,  0,  0,  3,  4,  0]]
m7_34 = [[0,  2,  1,  0,  0,  0,  0],
        [2, -1, -1,  1,  0,  0,  0],
        [3, -1, -1, -1,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [0,  3, -1, -1, -1, -1,  4],
        [0,  0,  3,  4,  3,  4,  0]]
m7_36 = [[0,  2,  1,  2,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [2, -1, -1, -1, -1, -1,  4],
        [3, -1, -1, -1, -1,  4,  0],
        [0,  3, -1, -1,  4,  0,  0],
        [0,  0,  3,  4,  0,  0,  0]]
m7_37 = [[0,  2,  1,  2,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1,  4,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [0,  3,  4,  3, -1, -1,  4],
        [0,  0,  0,  0,  3,  4,  0]]
m7_39 = [[0,  2,  1,  2,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1,  4,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [0,  3, -1, -1, -1, -1,  4],
        [0,  0,  3,  4,  3,  4,  0]]
m7_41 = [[0,  2,  1,  2,  1,  0,  0],
        [2, -1, -1, -1, -1,  1,  0],
        [3, -1, -1, -1, -1, -1,  1],
        [2, -1, -1, -1, -1, -1,  4],
        [3, -1, -1, -1, -1, -1,  1],
        [0,  3, -1, -1, -1, -1,  4],
        [0,  0,  3,  4,  3,  4,  0]]


import math

def split(a, n):
    k, m = divmod(len(a), n)
    return (a[i*k+min(i, m):(i+1)*k+min(i+1, m)] for i in range(n))

def MosaicMakerMatrix(dataMatrixList):
    n = int(math.sqrt(len(dataMatrixList)))
    return list(split(dataMatrixList,n))

def assemble_image(matrix, tile_images):
    """
    Assemble a final image based on a 5x5 matrix and a list of tile images.
    
    Parameters:
    - matrix: N x N matrix with tile indices (values from 0 to 10)
    - tile_images: List of images corresponding to tile indices (0 to 10)
    
    Returns:
    - Assembled Image
    """

    # Ensure the matrix is square
    if len(matrix) != len(matrix[0]):
        raise ValueError("Matrix must be square")
    
    N = len(matrix)
    
    # Get the size of one tile (assume all tiles are the same size)
    tile_width, tile_height = tile_images[0].size
    
    # Create a blank canvas large enough to hold the N x N grid
    canvas_width = tile_width * N
    canvas_height = tile_height * N
    final_image = Image.new("RGB", (canvas_width, canvas_height))
    
    # Place the tiles in the correct positions
    for row in range(N):
        for col in range(N):
            tile_index = matrix[row][col]
            tile_image = tile_images[tile_index]
            # Calculate the position on the canvas
            x_offset = col * tile_width
            y_offset = row * tile_height
            # Paste the tile onto the canvas
            final_image.paste(tile_image, (x_offset, y_offset))
    
    return final_image#.resize((tile_width, tile_height))

# Example usage:
if __name__ == "__main__":
    # Load your tiles (assuming you have 10 images named 'tile0.jpg', 'tile1.jpg', ..., 'tile10.jpg')
    tile_images = [Image.open(f'{i}.png') for i in range(11)]
    
    # Example 5x5 matrix with tile indices 0 to 10
    # Can also reference one of the above matrix names, e.g. matrix = m6_22

    #matrix = [[0,  2,  1,  0,  0,  0,  0],
    #              [2, -1, -1,  1,  0,  0,  0],
    #              [3, -1, -1, -1,  1,  0,  0],
    #              [2, -1, -1, -1, -1,  1,  0],
    #              [3, -1, -1, -1, -1, -1,  1],
    #              [0,  3,  4,  3, -1, -1,  4],
    #              [0,  0,  0,  0,  3,  4,  0]]

    #matrix = [[0,2,1,0,0],[2,8,10,1,0],[3,10,9,10,1],[0,3,7,8,4],[0,0,3,4,0]]
        
    matrix = MosaicMakerMatrix([0,2,1,0,0,0,2,10,7,1,0,0,3,9,10,7,1,0,0,3,7,10,9,1,
0,0,3,9,10,4,0,0,0,3,4,0])

    # Generate the final assembled image
    assembled_image = assemble_image(matrix, tile_images)
    
    # Show the result
    assembled_image.show()
    
    # Optionally save the result -- COMMENTED OUT UNTIL NEEDED
    #assembled_image.save('assembled_image.jpg')
