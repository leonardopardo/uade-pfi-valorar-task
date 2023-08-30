
import {OAS3Definition, OAS3Options} from 'swagger-jsdoc';
import swaggerJSDoc = require('swagger-jsdoc');

const definition: OAS3Definition = {
    "openapi": "3.0.3",
    "info": {
        "title": "Swagger - OpenAPI 3.0",
        "description": "",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
        "email": "apiteam@swagger.io"
        },
        "license": {
        "name": "Apache 2.0",
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "1.0.11"
        },

        "servers": [
        {
            "url": `${process.env.APP_HOST}/api/v1`
        }
    ],
    "components": {
        "schemas": {},
        "securitySchemes": {},
    }
}

const options: OAS3Options = {
    definition, apis: ['src/docs/swagger.ts']
}


export const swaggerSpec = swaggerJSDoc(options);