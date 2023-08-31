import * as fetch from 'node-fetch';
import { DataSource } from 'typeorm';
import { MongoDatasource } from '../MyDataSoure';
import { off } from 'process';
export class CabapropService {

    private baseUrl: string = process.env.SERVICE_CABAPROP_BASE_PATH;

    private ds: DataSource = MongoDatasource;

    constructor() {

    }

    async get(offset: number = 0, limit: number = 50): Promise<any> {
        try {
            
            const path = `${this.baseUrl}offset=${offset}&limit=${limit}`;
            
            const body = {
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

            console.log(path);

            const response = await fetch(path, {
                method: 'POST',
                body: JSON.stringify(body),
                ssl: false,
            })

            return response.json();
            
    } catch(err) {
        console.log(err);
    }
}
}