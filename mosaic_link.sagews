# Goal: convert from mosaic (matrix) to link enterable into Sage

import numpy as np

def add_mod_11(M):
    # Convert M to a numpy array if it's not already
    M = np.array(M)
    
    # Validate if the input is a square matrix
    if M.shape[0] != M.shape[1]:
        raise ValueError("Input must be a square matrix.")
    
    # Add 11 mod 11 to each element (effectively keeping the matrix unchanged)
    result = (M + 11) % 11
    
    return result

def mark_nines_and_tens(M):
    # Convert M to a numpy array if it's not already
    M = np.array(M)
    
    # Validate if the input is a square matrix
    if M.shape[0] != M.shape[1]:
        raise ValueError("Input must be a square matrix.")
    
    # Initialize matrix C with zeros of the same shape as M
    C = np.zeros_like(M, dtype=int)

    # Assign -1 where M == 10 or M == -1
    C[M == 10] = -1
    C[M == -1] = -1
    
    # Assign 1 where M == 9 or M == -2
    C[M == 9] = 1
    C[M == -2] = 1
    
    return C

# Input is an n x n matrix populated with 0 - 10 representing tiles
# Output is a list (length = # crossings) of an oriented knot acceptable by SageMath
def mosaic_to_link(mosaic):
    mosaic = add_mod_11(mosaic) #re-indexes entries so no negatives
    crossing_matrix = mark_nines_and_tens(mosaic)