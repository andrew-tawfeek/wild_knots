
# Input: List of lists, e.g. [[0,0,0],[1,2,3],[1,1,1]]
# Output: Markdown format for displaying mosaics

def mosaic(L): 
    for row in L:
        mosaic_string = ""
        for tile in row:
            mosaic_string = mosaic_string + "![[" + str(tile) + ".png]] "
        print(mosaic_string)
    return



# ![[1.png]] ![[1.png]] ![[1.png]]
# ![[1.png]] ![[1.png]] ![[1.png]]
# ![[1.png]] ![[1.png]] ![[1.png]]

