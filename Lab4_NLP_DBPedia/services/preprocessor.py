
import nltk
from nltk.stem import WordNetLemmatizer
from . import wordtest
WORDTEST = wordtest.WordTest()


class Preprocessor(object):
    """The main preprocessor class."""

    def __init__(self, text):
        '''DBPedia Preprocessor helper class.

        :param text: input to extract from
        '''
        self.original_text = text

    def get_tokens(self, text=None):
        '''

        :param text: if text is None then extract from is text from contruction
                        otherwise text is the new input for this function
        :return: array of tokens
        '''
        wordnet_lemmatizer = WordNetLemmatizer()
        extract_from = text
        if text is None:
            extract_from = self.original_text
        primare_tokens = nltk.word_tokenize(extract_from)
        tagged_tokens = nltk.pos_tag(primare_tokens)
        # Trebuiesc lematizate token-urile gasite.
        lematized_tokens = []
        for token, tag in tagged_tokens:
            pos = WORDTEST.penn_to_wn(tag)
            if pos is None:
                l_token = wordnet_lemmatizer.lemmatize(token)
            else:
                l_token = wordnet_lemmatizer.lemmatize(token, pos)
            lematized_tokens.append(l_token)
        # lematized_tokens = [wordnet_lemmatizer.lemmatize(token,tag) for token, tag in tagged_tokens]
        return lematized_tokens

