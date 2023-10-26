
# Valorar.ar - Task

Repositorio de tareas automatizadas que colaboran en el funcionamiento de la solución en general

### Requerimientos

- Python 3.10 +
- Nodejs 20.x.x +

### Instalación
Antes de comenzar con la instalación, se deben configurar las variables de entorno a ser utilizadas por la aplicación. Crear una copia del archivo `.env.example` y llamarla `.env`. Completar el archivo con la información requerida.

Realizar la instalación de las librerias con el siguiente comando:  
`npm install`

`pip install -r requirements.txt`  

Se puede comenzar la aplicación utilizando el comando  
`npm start`

### Guía de Repositorio
El repositorio fue generado como un servidor que, dentro de sus configuraciones, contiene tareas que se ejecutan de manera periódica a partir de un `cron`.

Se han implementado endpoints para la ejecución manual de estos procesos, pero estos no son utilizados en su funcioamiento normal.

En el repositorio se puede identificar la carpeta `/src/crons`. Aquí se pueden encontrar las diferentes tareas basadas en *cron* presentes en el repositorio. Se identifican las siguientes:

- **CabapropCron**: Este cron es el encargado de recolectar información en vivo de el sitio inmobiliario *Cabaprop*. Adicionalmente, ejecuta el proceso de normalización de información que es luego utilizado para el entrenamiento de los modelos.
- **MeliCron**: Este cron es el encargado de recolectar información en vivo de *Mercadolibre*, particularmente las publicaciones de propiedades en alquiler. Adicionalmente, ejecuta el proceso de normalización de información que es luego utilizado para el entrenamiento de los modelos.
- **MeliRefreshTokenCron**: Cron encargado de actualizar token de autenticación de Mercadolibre
- **SentimentCron**: Cron que se encarga de recolectar la información de distintos portales de noticias y procesar el sentimiento de los mismos para luego insertarlos en la base de datos para su posterior consulta.