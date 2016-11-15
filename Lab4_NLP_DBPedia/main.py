
from services.dbpediaagent import DBPediaAgent
from services.preprocessor import Preprocessor
from services.processorconsole import ConsoleProcessor
from services.processorxml import XmlProcessor

if __name__ == "__main__":
    BPEDIA = DBPediaAgent(bestResultOnly=True)
    TEXT = '''At eight o'clock on Thursday morning
                Arthur didn't feel very good. churches, walking'''
    # TEXT = 'SUN'
    PREPROC = Preprocessor(TEXT)
    TOKENS = PREPROC.get_tokens()
    RESULTS = []
    for token in TOKENS:
        posibilities = BPEDIA.process_token(token)
        RESULTS.append((token, posibilities))
    PROCESSOR = XmlProcessor(RESULTS)
    PROCESSOR.process()

