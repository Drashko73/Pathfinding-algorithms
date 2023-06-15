import xml.etree.ElementTree as ET

def parse_matrix(rows):
    matrix = []
    for i in range(rows):
        string = input()
        matrix.append(string.split(" "))
    
    return matrix

def create_xml_file(matrix_dimension_rows, matrix_dimension_columns, matrix_values):
    root = ET.Element("matrix")
    
    for i in range(matrix_dimension_rows):
        for j in range(matrix_dimension_columns):
            if int(matrix_values[i][j]) == 1:
                data = ET.SubElement(root, "data")
                indexI = ET.SubElement(data, "index_i")
                indexJ = ET.SubElement(data, "index_j")
                indexI.text = str(i)
                indexJ.text = str(j)
    
    tree = ET.ElementTree(root)
    tree.write("matrix.xml", encoding="UTF-8", xml_declaration=True)
    
rows = 13
columns = 30

matrica = parse_matrix(rows)
create_xml_file(rows, columns, matrica)

"""
0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 1 1 0 0 1 0 0 0 0 0 0 0 0 0 0
0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 1 1 0 0 1 0 0 0 0 1 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 1 0 1 0 0 0 1 0
0 0 0 0 1 1 0 1 1 0 0 0 1 1 0 1 1 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 0 0 1 1 0 1 1 0 0 1 1 1 0 1 1 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 0 0 1 1 0 1 1 1 0 1 1 1 0 1 1 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 -1 0 1 1 0 1 0 1 1 1 0 1 0 1 1 0 0 1 0 0 1 0 1 0 1 -2 1 0
0 0 0 0 1 1 0 1 0 0 1 0 0 1 0 1 1 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 0 0 1 1 0 1 0 0 0 0 0 1 0 1 1 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 0 0 1 1 0 1 0 0 0 0 0 1 0 1 1 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 1 0 1 0 1 0 1 0
0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 1 1 1 1 0 1 0 1 1 1 0
0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 1 0 0 0 0 0
"""
