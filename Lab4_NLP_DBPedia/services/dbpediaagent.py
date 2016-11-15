
import urllib.request  as url
# import os
import re
from pyquery import PyQuery as pq
from .models import dword



class DBPediaAgent(object):
    '''
    This is web Agent that creates a request to dbpedia api and gets xml response.
    Also helps parsing the data from that xml.
    '''

    def __init__(self, bestResultOnly=True):
        self.url_template = 'http://lookup.dbpedia.org/api/search/KeywordSearch?QueryString={token}'
        if bestResultOnly is True:
            self.url_template += '&MaxHits=1'

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
            return None

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
        regex = re.compile('(.+?)<ArrayOfResult .+?>', re.DOTALL)
        xml = re.sub(regex, '<ArrayOfResult>', xml)
        xml = re.sub("<(.+?)>", lambda match: match.group(0).lower(), xml)
        # print(xml)
        results = pq(xml)

        # fwrite = open('sample.xml', 'w')
        # fwrite.write(str(results))
        # fwrite.flush()
        # fwrite.close()
        # need to search more deeply not only first result , and chose most properly ontology

        results = results.children('result')
        output = []
        for child in results:
            word = dword.DWord()
            child = pq(child)
            label = child.children('label').eq(0).text()
            word.word = label

            classes = child.children('classes').eq(0)
            cvector = self.get_labels_for_children(classes, 'class')
            word.classes = list(cvector)

            categs = child.children('categories').eq(0)
            cavector = self.get_labels_for_children(categs, 'category')
            word.categories = list(cavector)

            output.append(word)

        return output

    def get_labels_for_children(self, node, childrenstring):
        """Given a xml Element object, and a string for children filtering,
            returns all the labels of it's direct children.
        :param node: An XML Element
        :param childrenstring: A string for children filtering.
        '"""
        output = []
        childs = pq(node).children(childrenstring)
        for child in childs:
            child = pq(child)
            label = child.children('label').eq(0).text()
            if label is not None:
                output.append(label)
        return output
