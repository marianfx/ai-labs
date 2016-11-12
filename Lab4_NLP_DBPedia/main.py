from Lab4_NLP_DBPedia.usefull.DBPedia_agent import DBPediaAgent
from Lab4_NLP_DBPedia.usefull.Preprocessor import Preprocessor
if __name__=="__main__":
    bpedia = DBPediaAgent()
    text = '''At eight o'clock on Thursday morning
                Arthur didn't feel very good. churches, walking'''
    preproc = Preprocessor(text)
    tokens = preproc.get_tokens()
    print('done')
    print('\n'.join(tokens))



