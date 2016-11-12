import nltk
from nltk.corpus import wordnet as wn
from nltk.stem import WordNetLemmatizer


class Preprocessor:
    '''

    '''

    def __init__(self, text):
        '''

        :param text: input to extract from
        '''
        self.original_text = text

    def get_tokens(self, text=None):
        wordnet_lemmatizer = WordNetLemmatizer()
        '''

        :param text: if text is none then extract from is text from contruction
                        otherwise text is the new input for this function
        :return: array of tokens
        '''
        extract_from = text
        if text is None:
            extract_from = self.original_text
        primare_tokens = nltk.word_tokenize(extract_from)
        tagged_tokens = nltk.pos_tag(primare_tokens)
        # Trebuie de lematizat token-urile gasite.
        lematized_tokens = []
        for token, tag in tagged_tokens:
            pos = self.penn_to_wn(tag)
            if pos is None:
                l_token = wordnet_lemmatizer.lemmatize(token)
            else:
                l_token = wordnet_lemmatizer.lemmatize(token, pos)
            lematized_tokens.append(l_token)
        # lematized_tokens = [wordnet_lemmatizer.lemmatize(token,tag) for token, tag in tagged_tokens]
        return lematized_tokens

    def is_noun(self, tag):
        return tag in ['NN', 'NNS', 'NNP', 'NNPS']

    def is_verb(self, tag):
        return tag in ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']

    def is_adverb(self, tag):
        return tag in ['RB', 'RBR', 'RBS']

    def is_adjective(self, tag):
        return tag in ['JJ', 'JJR', 'JJS']

    def penn_to_wn(self, tag):
        if self.is_adjective(tag):
            return wn.ADJ
        elif self.is_noun(tag):
            return wn.NOUN
        elif self.is_adverb(tag):
            return wn.ADV
        elif self.is_verb(tag):
            return wn.VERB
        return None
