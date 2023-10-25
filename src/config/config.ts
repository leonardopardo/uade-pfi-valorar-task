
export const corsConfig = {
    "cors": {
        "allowedHeaders": [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "X-Access-Token"
        ],
        "credentials": true,
        "methods": "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        "preflightContinue": false
    }
}

export const cabapropObject = {
    operationType: 2,
    propertyTypes: [],
    barrios: [],
    price: {
        currency: "ARS",
        min: 0,
        max: 0,
        tag: "pesos"
    },
    surface: {
        tag: "superficieTotal",
        type: "totalSurface",
        min: "",
        max: ""
    },
    ambiences: [],
    bedrooms: [],
    bathrooms: 0,
    garages: 0,
    extras: []
}