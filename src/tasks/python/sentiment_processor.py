## Procesador para obtener noticias de diferentes fuentes

import requests
from bs4 import BeautifulSoup
import json
import random
import urllib.parse
from pymongo.mongo_client import MongoClient
import json
import pandas as pd
import requests
import random
import os
from dotenv import load_dotenv
import tweetnlp
from datetime import datetime


filter_keywords = ["Alquileres", "Alquiler", "Alquilar", "Inmobiliario", "Inmobiliaria", "Propiedades"]

UAS = ("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1", 
       "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0",
       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0",
       "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36",
       "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36",
       )


def source_clarin():
    url = "https://www.clarin.com/tema/alquileres.html"

    ua = UAS[random.randrange(len(UAS))]
    response = requests.get(url, headers={'user-agent': ua})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        script_tag = soup.find_all('script', {'type': 'application/ld+json'})

        for tag in script_tag:
            script_content = tag.get_text()

            try:
                data = json.loads(script_content)
                
                if (
                    "@context" in data
                    and data["@context"] == "http://schema.org"
                    and "@type" in data
                    and data["@type"] == "ItemList"
                    and "itemListElement" in data
                ):
                    news_items = data["itemListElement"]
                    return_list = list()

                    for i, item in enumerate(news_items):
                        title = item.get("name", "")
                        url = item.get("url", "")
                        if title and url:
                            return_list.append({
                                "source": "Clarin",
                                "title": title,
                                "url": "https://clarin.com/" + url
                            })
                    return return_list   
            except json.JSONDecodeError as e:
                print("Error parsing Clarin JSON data:", e)     
    else:
        print(f"Failed to retrieve Clarin. Status code: {response.status_code}")

def source_p12():
    url = "https://www.pagina12.com.ar/tags/4798-alquileres"

    ua = UAS[random.randrange(len(UAS))]
    response = requests.get(url, headers={'user-agent': ua})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        script_tags = soup.find_all('script', type='application/ld+json')

        for tag in script_tags:
            script_content = tag.get_text()

            try:
                data = json.loads(script_content)
                if (
                    "@context" in data
                    and data["@context"] == "http://schema.org/"
                    and "@type" in data
                    and data["@type"] == "CollectionPage"
                ):
                    news_items_p12 = data["mainEntity"]["itemListElement"]

                    return_list = list()
                    for i, item in enumerate(news_items_p12):
                        title = item.get("name", "")
                        url = item.get("url", "")
                        if title and url:
                            return_list.append({
                                "source": "Pagina 12",
                                "title": title,
                                "url": url
                            })
                    return return_list
            except json.JSONDecodeError as e:
                print("Error parsing Pagina 12 JSON data:", e)
    else:
        print(f"Failed to retrieve Paigna 12. Status code: {response.status_code}")

def source_infobae():
    url = "https://www.infobae.com/tag/alquileres/"

    ua = UAS[random.randrange(len(UAS))]
    response = requests.get(url, headers={'user-agent': ua})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        news_elements = soup.find_all('a', class_='feed-list-card')
        
        return_list = list()
        for element in news_elements:
            title = element.find('h2').text.strip()
            url = element['href']
            
            if title and url:
                return_list.append({
                    "source": "Infobae",
                    "title": title,
                    "url": "https://infobae.com/" + url
                })
        return return_list
    else:
        print("Failed to retrieve the webpage. Status code:", response.status_code)

def source_ambito():
    url = "https://www.ambito.com/alquileres-a5124130"

    ua = UAS[random.randrange(len(UAS))]
    response = requests.get(url, headers={'user-agent': ua})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        news_elements = soup.find_all('article', class_='news-article')

        return_list = list()

        for news_element in news_elements:
            news_title = str(news_element.a["alt"]).replace("ámbito.com | ", "")
            news_url = news_element.a["href"]
            if news_title and news_url:
                return_list.append({
                    "source": "Ámbito Financiero",
                    "title": news_title,
                    "url": news_url
                })
        return return_list
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")

def source_ln():
    url = "https://www.lanacion.com.ar/tema/alquileres-tid59290/"

    ua = UAS[random.randrange(len(UAS))]
    response = requests.get(url, headers={'user-agent': ua})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        news_articles = soup.find_all("h2", class_="com-title")

        return_list = list()
        for article in news_articles:
            title = article.find("a").text.strip()
            article_url = article.find("a")["href"]
            if title and article_url:
                return_list.append({
                    "source": "La Nación",
                    "title": title,
                    "url": "https://lanacion.com.ar" + article_url
                })
        return return_list

    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")




# Extraemos las notas de clarin en relación a los alquileres
print("Obteniendo información de Clarin...")
clarin_items = source_clarin()

# Extraemos las notas de Página 12 en relación a los alquileres
print("Obteniendo información de Página 12...")
p12_items = source_p12()

# Extraemos las notas de Infobae en relación a los alquileres
print("Obteniendo información de Infobae...")
infobae_items = source_infobae()

# Extraemos las notas de Ambito Financiero en relacion a los alquileres
print("Obteniendo información de Ámbito Financiero...")
ambito_items = source_ambito()

# Extraemos las notas de La Nación en relacion a los alquileres
print("Obteniendo información de La Nación...")
ln_items = source_ln()

full_list = clarin_items + p12_items + infobae_items + ambito_items + ln_items

# Obtenemos las variables de entorno
PATH = os.getcwd()
PATH = PATH.replace("/Sentiment", "")

load_dotenv(PATH + "/.env")

username = urllib.parse.quote_plus(os.getenv("MONGO_USERNAME"))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASSWORD"))

uri = "mongodb://{}:{}@{}:{}/?authSource={}&authMechanism={}".format(username, password, os.getenv("MONGO_HOST"),
                                            os.getenv("MONGO_PORT"), os.getenv("MONGO_DATABASE"), "SCRAM-SHA-1")

client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client[os.getenv("MONGO_DATABASE")]
news_collection = db.Sentiment

model = tweetnlp.Sentiment()

for news in full_list:

    exists = news_collection.find({
        "source": news["source"],
        "title": news["title"],
        "url": news["url"],
        })
    
    if len(list(exists)) == 0:
        print("Agregando nueva noticia encontrada: " + news["title"])
        result = model.sentiment(news["title"], return_probability=True)
        tmp = news
        tmp["sentiment_positive"] = result["probability"]["positive"]
        tmp["sentiment_neutral"] = result["probability"]["neutral"]
        tmp["sentiment_negative"] = result["probability"]["negative"]
        tmp["created_at"] = datetime.now()
        news_collection.insert_one(tmp)



