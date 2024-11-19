from PIL import Image


#instead: input matrix1, matrix2, tileimages
# then set inner_knot (SINGULAR) to be knot of matrix1, i.e. assemble_image(matrix, tile_images) [optional third input?]
# then finally do assemble_image(matrix WITH THE X, tile_images) to produce knot with knots

# note how stopping at any finite stage just produces a tame knot by virtue of expanding out fibers at small knots... neat!!!

def assemble_image(matrix, tile_images,inner_knots):
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
            if tile_index != 'x':
                tile_image = tile_images[tile_index]
            else:
                tile_image = inner_knots[0]
            # Calculate the position on the canvas
            x_offset = col * tile_width
            y_offset = row * tile_height
            # Paste the tile onto the canvas
            final_image.paste(tile_image, (x_offset, y_offset))
    
    return final_image#.resize((tile_width, tile_height))

# Example usage:
if __name__ == "__main__":
    # Load your tiles (assuming you have 10 images named 'tile0.jpg', 'tile1.jpg', ..., 'tile10.jpg')
    tile_images = [Image.open(f'{i}.png') for i in range(10)]
    inner_knots = [Image.open(f'inner.png')]



    # TODO: Want to set up code to provide outer knot with 'x' and inner knot specification...






    
    # Example N x N matrix with tile indices 0 to 10 and inner knot labeled by 'x'
    matrix = [[0,  2,  1,  2,  1,  'x'],
                  [2, -1, -1, -1, -1,  1],
                  [3, -1, -1, -1, -1,  4],
                  [0,  3, -1, -1, -1,  1],
                  [0,  0,  3, -1, -1,  4],
                  ['x',  0,  0,  3,  4,  0]]
    
    # Generate the final assembled image
    assembled_image = assemble_image(matrix, tile_images,inner_knots)
    
    # Show the result
    assembled_image.show()
    
    # Optionally save the result -- COMMENTED OUT UNTIL NEEDED
    #assembled_image.save('knot_out.png')
