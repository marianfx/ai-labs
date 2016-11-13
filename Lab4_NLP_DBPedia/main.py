
from services.dbpediaagent import DBPediaAgent
from services.preprocessor import Preprocessor

if __name__ == "__main__":
    BPEDIA = DBPediaAgent()
    TEXT = '''At eight o'clock on Thursday morning
                Arthur didn't feel very good. churches, walking'''
    TEXT = 'SUN'
    PREPROC = Preprocessor(TEXT)
    TOKENS = PREPROC.get_tokens()
    RESULT = []
    for token in TOKENS:
        posibilities = BPEDIA.process_token(token)
        RESULT.append((token, posibilities))

    for resource in RESULT:
        print("TEXT TOKEN: " + resource[0])
        print("DBPEDIA POSIBILITIES:")
        for pos in resource[1]:
            print(pos)
        print("#####################")
        print("\n\n")
