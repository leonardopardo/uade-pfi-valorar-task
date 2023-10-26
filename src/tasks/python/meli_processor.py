import pymongo
import urllib.parse
import certifi
from pymongo.mongo_client import MongoClient
import json
import pandas as pd
import requests
import random
import warnings
import os
import sys

warnings.filterwarnings('ignore')

BASE_PATH = os.getcwd()

# Tomamos los barrios a cambiar
with open(BASE_PATH + "/src/docs/barrios_meli.json") as json_file:
    barrios_meli = json.load(json_file)

with open(BASE_PATH + "/src/docs/barrios.json") as json_file:
    barrios = json.load(json_file)

print("Comenzando ejecución Mercadolibre...")

username = urllib.parse.quote_plus(os.environ["MONGO_USERNAME"])
password = urllib.parse.quote_plus(os.environ["MONGO_PASSWORD"])

uri = "mongodb://{}:{}@{}:{}/?authSource={}&authMechanism={}".format(username, password, os.environ["MONGO_HOST"],
                                            os.environ["MONGO_PORT"], os.environ["MONGO_DATABASE"], "SCRAM-SHA-1")

client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client[os.environ["MONGO_DATABASE"]]

meli_collection = db.MeliStaging

print("Obteniendo propiedades...")
# Debido a que el tipo de operación esta embebido en el campo "attributes" vamos a tener
# que importar todo y filtrar luego
properties = meli_collection.find({})

properties_list = list()

for p in properties:
    properties_list.append(p)

properties_df = pd.DataFrame(properties_list)

processed_properties = list()

for index, row in properties_df.iterrows():
    
    # No tenemos info de características y/o amenities en MELI por ahora. Serán todas Falso (0)
    # por ahora

    balcony, yard, rooftop, garage, amoblado, cancha_paddle, cancha_tennis, gimnasio, hidromasaje, laundry = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    microcine, parrilla, piscina, sala_de_juegos, sauna, solarium, spa, sum, garage_visitas = 0, 0, 0, 0, 0, 0, 0, 0, 0

    # No se encuentra description en el objeto de Mercadolibre, aunque en el sitio existe
    description = ""

    centros_comerciales_cercanos, escuelas_cercanas, parques_cercanos = 0, 0, 0

    title = row["title"]

    # Manejo de Precio dolar
    if row["currency_id"] == "USD":
        price = int(row["price"])
    else:
        res = requests.get("https://dolarapi.com/v1/dolares")
        valor_blue_compra = res.json()[1]["compra"]
        price = int(row["price"]) / int(valor_blue_compra)

    # Manejo de Attributes, muchos ifs :(
    # Inicializamos primero las variables para luego filtrar en caso de
    # que no se encuentre info

    antiquity = None
    ambience, bedrooms, bathrooms = None, None, None
    surface_covered, surface_total = 0, 0
    neighborhood = None

    # Aqui encontraremos los "filtros" de tipo de propiedad y operacion
    # Vamos a guardar si debemos o no hacer un skip del agregado a la lista final
    # en una variable
    skip_row = None

    for attribute in row["attributes"]:
        skip_row = False
        if attribute["id"] == "BEDROOMS":
            bedrooms = int(attribute["value_name"])
        elif attribute["id"] == "FULL_BATHROOMS":
            bathrooms = int(attribute["value_name"])
        elif attribute["id"] == "ROOMS":
            ambience = int(attribute["value_name"])
        elif attribute["id"] == "TOTAL_AREA":
            try:
                surface_total = float(attribute["value_name"].replace(" m²", ""))
            except ValueError:
                skip_row = True
        elif attribute["id"] == "COVERED_AREA":
            try:
                surface_covered = float(attribute["value_name"].replace(" m²", ""))
            except ValueError:
                skip_row = True
        # Si no es un alquiler, skip
        elif attribute["id"] == "OPERATION":
            if attribute["value_name"] == "Venta" or attribute["value_name"] == "Alquiler temporal":
                skip_row = True
        # Si es una ofi, skip
        elif attribute["id"] == "PROPERTY_TYPE":
            if attribute["value_name"] == "Oficina":
                skip_row = True
        elif attribute["id"] == "ITEM_CONDITION":
            if attribute["value_name"] == "Usado":
                antiquity = random.randint(10, 40)
            else:
                antiquity = random.randint(0,5)
        elif attribute["id"] == "WITH_VIRTUAL_TOUR":
            pass
        elif attribute["id"] == "OFFICES":
            pass
        elif attribute["id"] == "HAS_TELEPHONE_LINE":
            pass
        elif attribute["id"] == "HAS_AIR_CONDITIONING":
            pass
        else:
            print("New Attribute Found: " + str(attribute["id"]))

    try:
        neighborhood = row["location"]["neighborhood"]["name"]
    except KeyError:
        # Esto significa que no tiene location, lo eliminamos
        skip_row = True

    if skip_row:
        continue

    if surface_covered > surface_total:
        surface_total = surface_covered
        
    surface_uncovered = surface_total - surface_covered

    processed_properties.append({
        "_id": row["_id"],
        "characteristincs_balcony": balcony,
        "characteristincs_yard": yard,
        "characteristincs_rooftop": rooftop,
        "characteristincs_garage": garage,
        "amenities_amoblado": amoblado,
        "amenities_cancha_paddle": cancha_paddle,
        "amenities_cancha_tenis": cancha_tennis,
        "amenities_gimnasio": gimnasio,
        "amenities_hidromasaje": hidromasaje,
        "amenities_laundry": laundry,
        "amenities_microcine": microcine,
        "amenities_parrilla": parrilla,
        "amenities_piscina": piscina,
        "amenities_sala_de_juegos": sala_de_juegos,
        "amenities_sauna": sauna,
        "amenities_solarium": solarium,
        "amenities_spa": spa,
        "amenities_sum": sum,
        "amenities_estacionamiento_visitas": garage_visitas,
        "location_neighbourhood": neighborhood,
        "antiquity": antiquity,
        "description": description,
        "title": title,
        "price": price,
        "ambience": ambience,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "surface_total": surface_total,
        "centros_comerciales_cercanos": centros_comerciales_cercanos,
        "parques_cercanos": parques_cercanos,
        "escuelas_cercanas": escuelas_cercanas
        })

proc_properties_df = pd.DataFrame(processed_properties)

print("Comenzando Normalización")
# Vamos a normalizar los nombres de las columnas (Barrios en particular) para que coincidan con cabaprop
# La mayoría son iguales, pero no todas

def change_neigh_name(value):
    if value in list(barrios_meli.keys()):
        return barrios_meli[value]
    else:
        return value

proc_properties_df.location_neighbourhood = proc_properties_df.location_neighbourhood.apply(change_neigh_name)

# Ahora que tenemos los nombres normalizados, podemos aplicar el one hot encoding

# Debemos asegurar que el modelo, al ser entrenado, tenga todas las columnas que necesitamos. Independientemente que la información
# venga de la fuente o no

# Debido a esto, vamos a crear columnas del tipo OneHot Encoding para cada uno de los barrios


# Generamos columnas para cada uno de los barrios
for neighborhood in barrios.values():
    proc_properties_df["location_neighbourhood_"+neighborhood] = 0

# No nos queda otra que iterar para ir seteando en 1 el barrio correcto. Es poco performante pero es la unica opcion
# Es como hacer un one hot encoding pero de forma manual.
for index, row in proc_properties_df.iterrows():
    # Obtenemos el nombre del barrio
    #barrio = barrios[str(row["location_neighbourhood"])]    
    proc_properties_df.at[index, "location_neighbourhood_"+row["location_neighbourhood"]] = 1

proc_properties_df.drop(["location_neighbourhood"], axis=1, inplace=True)
df_propiedades = proc_properties_df.copy(deep=True)
# Hay muchas propiedades que figuran para ser alquiladas pero en realidad estan a la venta
# Vamos a filtrar estos valores
df_propiedades = df_propiedades.loc[~df_propiedades.title.str.contains("venta")]
df_propiedades = df_propiedades.loc[~df_propiedades.title.str.contains("Venta")]
# Veamos la distribución de precios, encontramos que había precios con 0, por lo que los borramos
df_propiedades = df_propiedades.loc[df_propiedades.price > 50]
df_propiedades = df_propiedades.loc[df_propiedades.price < 10000]

# Vemos superficies con valor 0 y otras con espacios demasiado grandes, vamos a borrarlas
# Vamos a usar 10 metros cuadrados como minimo. 1000 metros cuadrados como máximo
df_propiedades = df_propiedades.loc[df_propiedades.surface_total > 10]
df_propiedades = df_propiedades.loc[df_propiedades.surface_total < 1000]
# Veamos como estan distribuidos los ambientes
# Vamos a borrar las entradas que no tienen información de ambientes
df_propiedades = df_propiedades.loc[df_propiedades.ambience > 0]
df_propiedades = df_propiedades.loc[df_propiedades.ambience.notna()]
# Veamos como estan distribuidos los cuartos

df_propiedades.loc[(df_propiedades.bedrooms == 0) & (df_propiedades.ambience == 1), "bedrooms"] = 1
df_propiedades.loc[(df_propiedades.bedrooms.isna()) & (df_propiedades.ambience == 1), "bedrooms"] = 1

df_propiedades.loc[(df_propiedades.bedrooms == 0) & (df_propiedades.ambience == 2), "bedrooms"] = 1
df_propiedades.loc[(df_propiedades.bedrooms.isna()) & (df_propiedades.ambience == 2), "bedrooms"] = 1

# Vamos a borrar las entradas que no tienen información de cuartos
df_propiedades = df_propiedades.loc[df_propiedades.bedrooms != 0]
df_propiedades = df_propiedades.loc[df_propiedades.bedrooms.notna()]
# Veamos como estan distribuidos los baños
# Vamos a rellenar los nulos con 1
df_propiedades['bathrooms'] = df_propiedades['bathrooms'].fillna(1)
df_propiedades.loc[(df_propiedades.bathrooms == 0), "bathrooms"] = 1
# Hay algunas con antiguedad en None, las quitamos del dataset
df_propiedades = df_propiedades.loc[df_propiedades.antiquity.notna()]

from pymongo.errors import DuplicateKeyError
# Insertamos la información en nuestra DB final en mongo

final_collection = db.PriceProduction

data_to_insert = df_propiedades.to_dict(orient="records")

print("Actualizando información en base de datos...")

for data in data_to_insert:
    try:
        final_collection.insert_one(data)
    # Esto significa que ya agregamos la propiedad antes, por lo que la actualizamos
    except DuplicateKeyError as e:
        target_id = data["_id"]
        res = final_collection.replace_one({"_id": target_id}, data)

print("Finalizado!")



