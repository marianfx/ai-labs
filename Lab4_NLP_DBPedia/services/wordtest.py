
from nltk.corpus import wordnet as wn

class WordTest(object):
    """Class containing static methods for word / tag checking."""
    @staticmethod
    def is_noun(tag):
        """Check if tag represents NOUN."""
        return tag in ['NN', 'NNS', 'NNP', 'NNPS']

    @staticmethod
    def is_verb(tag):
        """Check if tag represents VERB."""
        return tag in ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']

    @staticmethod
    def is_adverb(tag):
        """Check if tag represents ADVERB."""
        return tag in ['RB', 'RBR', 'RBS']

    @staticmethod
    def is_adjective(tag):
        """Check if tag represents ADJECTIVE."""
        return tag in ['JJ', 'JJR', 'JJS']

    @staticmethod
    def penn_to_wn(tag):
        """Converts statig tag into wordnet object.
        :return: WordNet Object or None
        """
        if WordTest.is_adjective(tag):
            return wn.ADJ
        elif WordTest.is_noun(tag):
            return wn.NOUN
        elif WordTest.is_adverb(tag):
            return wn.ADV
        elif WordTest.is_verb(tag):
            return wn.VERB
        return None
