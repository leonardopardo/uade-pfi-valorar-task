import * as fetch from 'node-fetch';
import { DataSource } from 'typeorm';
import { MongoDatasource } from '../MyDataSoure';
import { off } from 'process';
export class CabapropService {

    private baseUrl: string = process.env.SERVICE_CABAPROP_BASE_PATH;

    private ds: DataSource = MongoDatasource;

    constructor() {

    }

    async get(offset: number = 0, limit: number = 12): Promise<any> {
        try {
            
            const path = `${this.baseUrl}offset=${offset}&limit=${limit}&orderBy=created_at&sort=desc`;

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

            const response = await fetch(path, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            })

            console.log(response);

            return await response.json();
            
    } catch(err) {
        console.log(err);
    }
}
}