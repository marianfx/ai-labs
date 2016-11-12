import urllib.request  as url


class DBPediaAgent:
    '''
    This is web Agent that create a request to dbpedia api and gets xml response
    eventually extract data from that xml
    '''

    def __init__(self):
        self.url_template = 'http://lookup.dbpedia.org/api/search/KeywordSearch?QueryString={token}'

    def request(self, word):
        '''

        :param word: word to search for
        :return: xml_data from dbpedia apie or None if there is no such a word
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
        if xml is None:
            return None
        #       here we parse xml and return category of searched token
        #       ...
