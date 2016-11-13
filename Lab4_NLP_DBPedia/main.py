
from services.dbpediaagent import DBPediaAgent
from services.preprocessor import Preprocessor

import nltk
nltk.download()

if __name__ == "__main__":
    BPEDIA = DBPediaAgent()
    TEXT = '''At eight o'clock on Thursday morning
                Arthur didn't feel very good. churches, walking'''
    PREPROC = Preprocessor(TEXT)
    TOKENS = PREPROC.get_tokens()
    RESULT = []
    for token in TOKENS:
        category = BPEDIA.process_token(token)
        RESULT.append((token, category))
        print(token)
        print(str(category))
