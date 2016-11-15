

class AbstractProcessor(object):
    """The abstract class for processing the results."""

    def __init__(self, tokenpairs):
        self.tokenPairs = tokenpairs

    def process(self):
        print("This is the abstract class. Cannot process. Try instanciating.")
