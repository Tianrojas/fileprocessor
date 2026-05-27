
import numpy as np

def sum_matrices(a, b):
    arr1 = np.array(a)
    arr2 = np.array(b)

    result = arr1 + arr2

    return result.tolist()
