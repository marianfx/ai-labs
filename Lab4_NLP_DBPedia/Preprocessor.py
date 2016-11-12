import nltk
class Preprocessor:
    '''

    '''
    def __init__(self, text):
        '''

        :param text: input to extract from
        '''
        self.original_text = text

    def get_tokens(self, text=None):
        '''

        :param text: if text is none then extract from is text from contruction
                        otherwise text is the new input for this function
        :return: array of tokens
        '''
        extract_from = text
        if text is None:
            extract_from = self.original_text
        primare_tokens = nltk.word_tokenize(extract_from)
        #Trebuie de lematizat token-urile gasite.
        return primare_tokens