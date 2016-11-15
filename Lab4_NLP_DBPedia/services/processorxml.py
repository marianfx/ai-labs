
import datetime
from xml.etree.ElementTree import Element, SubElement, Comment, tostring
from xml.dom import minidom
from .processorgeneric import AbstractProcessor


class XmlProcessor(AbstractProcessor):

    def __init__(self, tokenpairs):
        AbstractProcessor.__init__(self, tokenpairs)

    def prettify(self, elem):
        """Return a pretty-printed XML string for the Element.
        """
        rough_string = tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent="  ")

    def writestring(self, text):
        fwrite = open('result.xml', 'w')
        fwrite.write(text)
        fwrite.flush()
        fwrite.close()

    def process(self):
        generateon = str(datetime.datetime.now())
        comment = Comment('Generated on ' + generateon + ' by DbPedia Parser.')
        root = Element('root')
        root.append(comment)

        for pair in self.tokenPairs:
            text = pair[0]
            dbpediaresults = pair[1]
            child = SubElement(root, 'word')
            child.text = text
            keynumber = 0
            for result in dbpediaresults:
                keyword = result.word
                keynumber += 1
                classes = result.classes
                categs = result.categories
                keywordchild = SubElement(child, 'keyword', {'from': 'DBPedia', 'id': str(keynumber)})
                keywordchild.text = keyword
                classescomponent = SubElement(keywordchild, 'classes')
                for theclass in classes:
                    classchild = SubElement(classescomponent, 'class')
                    classchild.text = theclass
                categscomponent = SubElement(keywordchild, 'categories')
                for categ in categs:
                    categchild = SubElement(categscomponent, 'category')
                    categchild.text = categ
        prettyxml = self.prettify(root)
        self.writestring(prettyxml)
