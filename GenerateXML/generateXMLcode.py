import xml.etree.ElementTree as ET

def parseInput():
    listOfLines = list()
    i = 1
    line = input()
    while(i < 1000 and line != "STOP"):
        listOfLines.append(line)
        i += 1
        line = input()
    return listOfLines

def create_xml_file(listOfLines):
    root = ET.Element("algorithm")
    for line in listOfLines:
        newLine = ""
        for letter in line:
            if(letter == "\t"):
                newLine += 4 * " "
            else:
                newLine += letter
        data = ET.SubElement(root, "data")
        lineElement = ET.SubElement(data, "line")
        lineElement.text = str(newLine)
    
    tree = ET.ElementTree(root)
    tree.write("algorithmsCreation.xml", encoding="UTF-8", xml_declaration=True)
    
listOfLines = parseInput()
create_xml_file(listOfLines)
