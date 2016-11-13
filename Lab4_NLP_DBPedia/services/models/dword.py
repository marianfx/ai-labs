
class DWord(object):

    def __init__(self, word=None, classes=[], categories=[]):
        self.word = word
        self.classes = classes
        self.categories = categories

    def get_repr(self):
        output = "Word: " + self.word + "\n"
        output += "Classes: " + str(self.classes) + "\n"
        output += "Categories: " + str(self.categories) + "\n"
        return output

    def __str__(self):
        return self.get_repr()

    def __repr__(self):
        return self.get_repr()

