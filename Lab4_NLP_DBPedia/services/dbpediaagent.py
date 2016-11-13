
import urllib.request  as url
import re
from pyquery import PyQuery as pq


class DBPediaAgent(object):
    '''
    This is web Agent that creates a request to dbpedia api and gets xml response.
    Also helps parsing the data from that xml.
    '''

    def __init__(self):
        self.url_template = 'http://lookup.dbpedia.org/api/search/KeywordSearch?QueryString={token}'

    def request(self, word):
        '''
        :param word: word to search for
        :return: XML data from dbpedia API or None if there is no such a word
        '''
        dbpedia_xml = None
        adress = self.url_template.format(token=word)
        try:
            dbpedia_xml = url.urlopen(adress).read()
        except Exception as e:
            print(e)

        return dbpedia_xml

    def process_token(self, token):
        '''

        :param token: token process to
        :return: list of ontologies in which token is classified if there is one,
                 None otherwise
        '''
        xml = self.request(token)
        xml = xml.decode('utf-8')
        if xml is None:
            return None
        # here we parse xml and return category of searched token
        #       ...

        # print(xml)
        r = re.compile('(.+?)<ArrayOfResult .+?>',re.DOTALL)
        xml = re.sub(r, '<ArrayOfResult>', xml)
        xml = re.sub("<(.+?)>", lambda match: match.group(0).lower(), xml)
        # print(xml)
        d = pq(xml)
        # need to search more deeply not only first result , and chose most properly ontology
        first_result = d('result:first')
        # print(first_result)

        return first_result
