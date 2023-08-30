import fetch from 'node-fetch';
import { MongoDatasource } from '../MyDataSoure';

export class MeliService {
  private dataSource: MongoDatasource = MongoDatasource.manager;
  
  private city: string;
  private baseUrl: string = process.env.SERVICE_MELI_BASE_PATH

  constructor() {
    this.city = process.env.SERVICE_MELI_CITY;
  }

  async get(category: string, offset: number = 0, limit: number = 50): Promise<any> {
    try {
      const service = `${this.baseUrl}category=${category}&city=${this.city}&offset=${offset}&limit=${limit}`
      const response = await fetch(service, {
        method: 'GET'
      })
      return response.json()
    } catch (err) {
      console.log(err);
    }
  }

  async insert(body: any): Promise<any> {
    try {
      const dataSource = MongoDatasource.manager;

      dataSource
        .createQueryBuilder()
        .insert()
        .into('MeliStaging')
        .values(body)
        .execute()

    } catch (err) {
      console.log(err);
    }
  }
}
