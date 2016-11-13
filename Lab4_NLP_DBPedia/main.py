from Lab4_NLP_DBPedia.usefull.DBPedia_agent import DBPediaAgent
from Lab4_NLP_DBPedia.usefull.Preprocessor import Preprocessor
if __name__=="__main__":
    bpedia = DBPediaAgent()
    text = '''At eight o'clock on Thursday morning
                Arthur didn't feel very good. churches, walking'''
    preproc = Preprocessor(text)
    tokens = preproc.get_tokens()
    result = []
    for token in tokens:
        category = bpedia.process_token(token)
        result.append((token,category))
        print(token)
        print(str(category))