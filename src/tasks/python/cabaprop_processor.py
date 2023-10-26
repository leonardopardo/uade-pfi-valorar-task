import urllib.parse
from pymongo.mongo_client import MongoClient
import os
import pandas as pd
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import json
import warnings

warnings.filterwarnings('ignore')

BASE_PATH = os.getcwd()

with open(BASE_PATH + "/src/docs/barrios.json") as json_file:
    barrios = json.load(json_file)

print("Comenzando ejecución CABAPROP...")

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

cabaprop_collection = db.CabapropStaging

# Debido a que el tipo de operación esta embebido en el campo "attributes" vamos a tener
# que importar todo y filtrar luego

operation_ids = [2,3]
property_ids = [1,2,3]

print("Obteniendo propiedades...")

propiedades = cabaprop_collection.find({
    "operation_type": {"$in": operation_ids},
    "property_type": {"$in": property_ids}
    })
print(cabaprop_collection.count_documents({
    "operation_type": {"$in": operation_ids},
    "property_type": {"$in": property_ids}
    }))

# Debido a que tenemos muchos objetos en la entrada y no necesitamos todos, vamos a
# Realizar un loop para solo quedarnos con las cosas que necesitamos

propiedades_list = list()

len_propiedades = len(propiedades_list)
# No todas las columnas nos van a importar, hay que pensar que esta es información
# que vamos a pedirle luego a los usuarios para realizar la predicción.

# Notar que este análisis se hizo en base de la matriz de correlación de las variables

for p in propiedades:
    try:
        propiedades_list.append({
            "_id": p["_id"],
            "characteristincs_balcony": p["characteristics"]["balcony"]["active"],
            "characteristincs_yard": p["characteristics"]["yard"]["active"],
            "characteristincs_rooftop": p["characteristics"]["rooftop"]["active"],
            "characteristincs_garage": p["characteristics"]["garages"]["active"],
            "amenities_amoblado": p["extras"]["adicionales"]["amoblado"],
            "amenities_cancha_paddle": p["extras"]["adicionales"]["cancha_paddle"],
            "amenities_cancha_tenis": p["extras"]["adicionales"]["cancha_tenis"],
            "amenities_gimnasio": p["extras"]["adicionales"]["gimnasio"],
            "amenities_hidromasaje": p["extras"]["adicionales"]["hidromasaje"],
            "amenities_laundry": p["extras"]["adicionales"]["laundry"],
            "amenities_microcine": p["extras"]["adicionales"]["microcine"],
            "amenities_parrilla": p["extras"]["adicionales"]["parrilla"],
            "amenities_piscina": p["extras"]["adicionales"]["piscina"],
            "amenities_sala_de_juegos": p["extras"]["adicionales"]["sala_de_juegos"],
            "amenities_sauna": p["extras"]["adicionales"]["sauna"],
            "amenities_solarium": p["extras"]["adicionales"]["solarium"],
            "amenities_spa": p["extras"]["adicionales"]["spa"],
            "amenities_sum": p["extras"]["adicionales"]["sum"],
            "amenities_estacionamiento_visitas": p["extras"]["adicionales"]["estacionamiento_visitas"],
            "antiquity": p["antiquity"]["years"],
            "price": p["price"]["total"],
            "price_currency": p["price"]["currency"],
            "location_neighbourhood": p["location"]["barrios"][0],
            "ambience": p["characteristics"]["ambience"],
            "bedrooms": p["characteristics"]["bedrooms"],
            "bathrooms": p["characteristics"]["bathrooms"],
            "surface_total": p["surface"]["totalSurface"],
            "centros_comerciales_cercanos": p["extras"]["adicionales"]["centros_comerciales_cercanos"],
            "parques_cercanos": p["extras"]["adicionales"]["parques_cercanos"],
            "escuelas_cercanas": p["extras"]["adicionales"]["escuelas_cercanas"],
            "property_type": p["property_type"],
            "operation_type": p["operation_type"]
        })
    except Exception:
        try: 
            propiedades_list.append({
                "_id": p["_id"],
                "characteristincs_balcony": False,
                "characteristincs_yard": False,
                "characteristincs_rooftop": False,
                "characteristincs_garage": False,
                "amenities_amoblado": False,
                "amenities_cancha_paddle": False,
                "amenities_cancha_tenis": False,
                "amenities_gimnasio": False,
                "amenities_hidromasaje": False,
                "amenities_laundry": False,
                "amenities_microcine": False,
                "amenities_parrilla": False,
                "amenities_piscina": False,
                "amenities_sala_de_juegos": False,
                "amenities_sauna": False,
                "amenities_solarium": False,
                "amenities_spa": False,
                "amenities_sum": False,
                "amenities_estacionamiento_visitas": False,
                "antiquity": p["antiquity"]["years"],
                "price": p["price"]["total"],
                "price_currency": p["price"]["currency"],
                "location_neighbourhood": p["location"]["barrios"][0],
                "ambience": p["characteristics"]["ambience"],
                "bedrooms": p["characteristics"]["bedrooms"],
                "bathrooms": p["characteristics"]["bathrooms"],
                "surface_total": p["surface"]["totalSurface"],
                "centros_comerciales_cercanos": p["extras"]["adicionales"]["centros_comerciales_cercanos"],
                "parques_cercanos": p["extras"]["adicionales"]["parques_cercanos"],
                "escuelas_cercanas": p["extras"]["adicionales"]["escuelas_cercanas"],
                "property_type": p["property_type"],
                "operation_type": p["operation_type"]
            })
        except Exception:
            continue

print("Comenzando normalización...")

df_propiedades = pd.DataFrame(propiedades_list)

df_propiedades.price = pd.to_numeric(df_propiedades.price, errors="coerce")

df_propiedades = df_propiedades.astype({"price": int, "price": int})

# Primero que nada, sabemos que hay precios en pesos y dolares, por lo que debemos normalizar esta información
# Obtenemos el precio del dolar
import requests
res = requests.get("https://dolarapi.com/v1/dolares/blue")
dolar_blue = res.json()["compra"]

def convertir_a_pesos(currency, precio):
    if currency == 2:
        return precio/dolar_blue
    else:
        return precio

df_propiedades.price = df_propiedades.apply(lambda row: convertir_a_pesos(row["price_currency"], row["price"]), axis=1)

# Borramos las columnas de Currency, ya que no las utiliazríamos mas
df_propiedades.drop(["price_currency"], axis=1, inplace=True)

# Encontramos precios con valores 0, 1, 10, etc
# Vamos a tomar 50 dolares como el valor base para un alquiler
# También hay outliers, precios demasiado altos para un alquiler
df_propiedades = df_propiedades.loc[df_propiedades.price > 50]
df_propiedades = df_propiedades.loc[df_propiedades.price < 10000]

# Vemos superficies con valor 0 y otras con espacios demasiado grandes, vamos a borrarlas
# Vamos a usar 10 metros cuadrados como minimo. 1000 metros cuadrados como máximo
df_propiedades = df_propiedades.loc[df_propiedades.surface_total > 10]
df_propiedades = df_propiedades.loc[df_propiedades.surface_total < 1000]

# Veamos los barrios, aca tenemos muchos ID para los distintos barrios.
# Estos vienen de barrios.ts

# Debemos asegurar que el modelo, al ser entrenado, tenga todas las columnas que necesitamos. Independientemente que la información
# venga de la fuente o no

df_propiedades = df_propiedades.loc[df_propiedades.location_neighbourhood.notna()]
# Debido a esto, vamos a crear columnas del tipo OneHot Encoding para cada uno de los barrios



# Generamos columnas para cada uno de los barrios
for neighborhood in barrios.values():
    df_propiedades["location_neighbourhood_"+neighborhood] = 0

# No nos queda otra que iterar para ir seteando en 1 el barrio correcto. Es poco performante pero es la unica opcion
# Es como hacer un one hot encoding pero de forma manual.
for index, row in df_propiedades.iterrows():
    # Obtenemos el nombre del barrio
    barrio = barrios[str(row["location_neighbourhood"]).replace(".0","")]    
    df_propiedades.at[index, "location_neighbourhood_"+barrio] = 1

df_propiedades.drop(["location_neighbourhood"], axis=1, inplace=True)

# Veamos como estan distribuidos los ambientes
# Vamos a borrar las entradas que no tienen información de ambientes
df_propiedades = df_propiedades.loc[df_propiedades.ambience != 0]
df_propiedades = df_propiedades.loc[df_propiedades.ambience.notna()]

# Veamos como estan distribuidos los cuartos
# Vamos a borrar las entradas que no tienen información de cuartos
df_propiedades = df_propiedades.loc[df_propiedades.bedrooms != 0]
df_propiedades = df_propiedades.loc[df_propiedades.bedrooms.notna()]

# Veamos como estan distribuidos los baños
# Vamos a rellenar los nulos con 1
df_propiedades['bathrooms'] = df_propiedades['bathrooms'].fillna(1)

df_propiedades.bathrooms = pd.to_numeric(df_propiedades.bathrooms, errors="coerce")

# Vamos a convertir las columnas True / False en 0 y 1 para que pueda ser utilizado en los modelos
df_propiedades.replace({False: 0, True: 1}, inplace=True)

df_final_test = df_propiedades.drop(["property_type", "operation_type"], axis=1)

# Aplicamos OneHotEncoding de las variables que apliquen
#df_final_test = pd.get_dummies(df_final_test)

# Pasamos los true/false a 0,1 nuevamente
df_final_test.replace({False: 0, True: 1}, inplace=True)

# Antiguedad -100 la pasamos a 0
df_final_test.loc[(df_final_test.antiquity==-100), ["antiquity"]] = 0

from pymongo.errors import DuplicateKeyError
# Insertamos la información en nuestra DB final en mongo

final_collection = db.PriceProduction

data_to_insert = df_final_test.to_dict(orient="records")

print("Actualizando información en base de datos...")

for data in data_to_insert:
    try:
        final_collection.insert_one(data)
    # Esto significa que ya agregamos la propiedad antes, por lo que la actualizamos
    except DuplicateKeyError as e:
        target_id = data["_id"]
        res = final_collection.replace_one({"_id": target_id}, data)

print("Finalizado!")



