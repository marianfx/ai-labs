
from .processorgeneric import AbstractProcessor

class ConsoleProcessor(AbstractProcessor):

    def __init__(self, tokenpairs):
        AbstractProcessor.__init__(self, tokenpairs)

    def process(self):
        for pair in self.tokenPairs:
            print("####################")
            print("TEXT TOKEN: " + pair[0])
            print("DBPEDIA POSIBILITIES: " + str(len(pair[1])))
            print("####################")
            for pos in pair[1]:
                print(pos)
            print("--------------------")
            print("\n")

