# An implementation of wild mosaic theory into SageMath.

class Tile():
    def __init__(self,N):
        self.tile = N
        self.orientation = []
        if (N == 0):
            self.numConnectionPoints = 0
            self.connectionDirections = []
        if (N in [1,2,3,4,5,6]):
            self.numConnectionPoints = 2
            if (N==1):
                self.connectionDirections = ['left','down']
            if (N==2):
                self.connectionDirections = ['right','down']
            if (N==3):
                self.connectionDirections = ['up','right']
            if (N==4):
                self.connectionDirections = ['left','up']
            if (N==5):
                self.connectionDirections = ['left','right']
            if (N==6):
                self.connectionDirections = ['up','down']
        if (N in [7,8,9,10]):
            self.numConnectionPoints = 4
            self.connectionDirections = ['up','down','left','right']
    def show(self, resolution = 5):
        if (self.tile==0):
            return line([(0,0),(1,0)], axes = False, xmin = 0, xmax = 1, ymin = 0, ymax = 1, frame = True, ticks=[[],[]], thickness=0).plot()
        if (self.tile==1):
            return arc((0,0), 1, sector=(0,pi/2), axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==2):
            return arc((0,0), 1, sector=(0,pi), axes = False, xmin = -2, xmax = 0, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==3):
            return arc((0,0), 1, sector=(pi,2*pi), axes = False, xmin = -2, xmax = 0, ymin = -2, ymax = 0, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==4):
            return arc((0,0), 1, sector=(pi,2*pi), axes = False, xmin = 0, xmax = 2, ymin = -2, ymax = 0, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==5):
            return line([(0,1), (1,1)], axes = False, xmin = 0, xmax = 1, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==6):
            return line([(1,0), (1,1)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 1, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==7):
            return arc((0,0), 1, sector=(0,pi/2), axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot() + arc((2,2), 1, sector=(pi,2*pi), axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==8):
            return arc((0,2), 1, sector=(2*pi/3,2*pi), axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot() + arc((2,0), 1, sector=(pi,pi/2), axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==9):
            return line([(0,1), (2,1)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot() + line([(1,0), (1,.6)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot() + line([(1,1.4), (1,2)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
        if (self.tile==10):
            return line([(1,2), (1,0)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot() + line([(0,1), (.6,1)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot() + line([(1.4,1), (2,1)], axes = False, xmin = 0, xmax = 2, ymin = 0, ymax = 2, frame = True, ticks=[[],[]], thickness=resolution).plot()
    def isGoing(self, direction):
        # e.g. Tile(6).isGoing('up') returns True but Tile(6).isGoing('left') returns False
        # This is good for checking suitable connectivity later
        return direction in self.connectionDirections
    def zoom(self):
        # Every tile becomes 3x3 matrix
        # TODO: Later, iterate this with an input "amount"
        N = self.tile
        if (N==0):
            return [[0,0,0],[0,0,0],[0,0,0]]
        if (N==1):
            return [[0,0,0],[5,1,0],[0,6,0]]
        if (N==2):
            return [[0,0,0],[0,2,5],[0,6,0]]
        if (N==3):
            return [[0,6,0],[0,3,5],[0,0,0]]
        if (N==4):
            return [[0,6,0],[5,4,0],[0,0,0]]
        if (N==5):
            return [[0,0,0],[5,5,5],[0,0,0]]
        if (N==6):
            return [[0,6,0],[0,6,0],[0,6,0]]
        if (N==7):
            return [[0,3,1],[1,0,3],[3,1,0]]
        if (N==8):
            return [[2,4,0],[4,0,2],[0,2,4]]
        if (N==9):
            return [[0,6,0],[5,9,5],[0,6,0]]
        if (N==10):
            return [[0,6,0],[5,10,5],[0,6,0]]
    def orient(self, direction):
        # Assigns an orientation to a tile
        assert direction in self.connectionDirections #returns error if orientation not possible
        self.orientation = self.orientation + [direction]

class Mosaic():
    def __init__(self,mosaic_matrix): #Takes input matrix or list of lists (array)
        self.matrixRepresentation = matrix(mosaic_matrix)
        self.size = len(self.matrixRepresentation.rows())
        #attributes/properties of object go here
    def __repr__(self):
        # This representation is announced upon construction. Comment out later, here for testing.
        return f"Mosaic of dimension {self.size}."
    def show(self, resolution = 5):
        # Letting W = Mosaic(M) for a matrix M then running W.show() outputs a graphic for the mosaic
        return graphics_array([[x.show() for x in row] for row in [list(map(Tile,row)) for row in [list(x) for x in self.matrixRepresentation]]]).show(figsize=[resolution, resolution])
    def matrix(self):
        # Letting W = Mosaic(M) for a matrix M, and doing W.matrix() returns the matrix representation of the mosaic
        return self.matrixRepresentation
    def directions(self,i,j):
        # Letting W = Mosaic(M) for a matrix M, doing W.directions(i,j) returns the connection points
        # of the (i,j)th tile, where (0,0) is the tile in the upper-left (matrix notation, indexed at 0)
        M = self.matrixRepresentation
        directions = Tile(M[i][j]).connectionDirections
        return directions
    def isSuitablyConnected(self):
        # As above, for W = Mosaic(M), doing W.isSuitablyConnected() returns either True/False based on connectivity
        M = self.matrixRepresentation
        for i in range(self.size):
            for j in range(self.size):
                if Tile(M[i][j]).isGoing('up'):
                    if i == 0:
                        return False
                    elif not Tile(M[i-1][j]).isGoing('down'):
                        return False
                if Tile(M[i][j]).isGoing('left'):
                    if j == 0:
                        return False
                    elif not Tile(M[i][j-1]).isGoing('right'):
                        return False
                if Tile(M[i][j]).isGoing('right'):
                    if j == self.size-1:
                        return False
                    elif not Tile(M[i][j+1]).isGoing('left'):
                        return False
                if Tile(M[i][j]).isGoing('down'):
                    if i == self.size-1:
                        return False
                    elif not Tile(M[i+1][j]).isGoing('up'):
                        return False
        return True
    def zoom(self):
        # Zooms by 3x, replaces each tile by a 3x3 isotopy equivalent tile
        # Usage is W.zoom() fro W = Mosaic(M)
        M = self.matrixRepresentation
        M_tensored = [[Tile(x).zoom() for x in row] for row in [list(x) for x in list(M)]]
        A = [] # The below code unwraps inner 3x3 subtiles
        for n in range(len(M_tensored)*3):
            A = A + [[x[n%3] for x in M_tensored[floor(n/3)]]] #Euclidean division, n = floor(n/3)*3 + n%3
        B = [] # The below code unwraps inner 1x3 subtiles
        for row in A:
            tupe = []
            for tuple in row:
                tupe = tupe + tuple
            B = B + [tupe]
        return Mosaic(B)

def random_mosaic(dimension):
    # This code is embarassing, but if it's stupid and it works it's not stupid.
    # Good luck ever getting this to work for high dimension! Technically, you need luck. Like, a lot of it.
    connect_check = False
    while connect_check == False:
        M = Mosaic(random_matrix(GF(11),dimension,dimension))
        connect_check = M.isSuitablyConnected()
    return M


# Example code:
# M = matrix([[0,2,1,0,0],[2,9,10,1,0],[3,10,9,10,1],[0,3,7,8,4],[0,0,3,4,0]]); W = Mosaic(M);
# W.matrix() 
# W.show()
# W.isSuitablyConnected()
# M2 = matrix([[0,2,1,0,0],[3,9,10,1,0],[3,10,9,10,1],[0,3,7,8,4],[0,0,3,4,0]]); W2 = Mosaic(M2); W2.show()
# W2.isSuitablyConnected()