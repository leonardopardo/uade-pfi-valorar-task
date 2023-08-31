import * as fetch from "node-fetch";
import { MongoDatasource } from "../MyDataSoure";
import { DataSource, Repository } from "typeorm";
import { MeliModel } from "../models/MeliModel";

export class MeliService {
  private baseUrl: string = process.env.SERVICE_MELI_BASE_PATH;

  private city: string = process.env.SERVICE_MELI_CITY;

  private ds: DataSource = MongoDatasource;

  private repository: Repository<MeliModel>;

  constructor() {
    this.repository = this.ds.getRepository(MeliModel);
  }

  public async get(
    category: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<any> {
    try {
      const service = `${this.baseUrl}category=${category}&city=${this.city}&offset=${offset}&limit=${limit}`;

      const response = await fetch(service, {
        method: "GET",
      });

      return response.json();
    } catch (err) {
      throw new Error(`Ocurrió un error en ${MeliService.name} al obtener los datos de Meli.\n ${err}`);
    }
  }

  public async insert(list: MeliModel[]): Promise<void> {
    try {
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        this.insertOne(element);
      }
    } catch (err) {
      throw new Error(
        `Ocurrió un error al insertar los datos de ${MeliService.name}.\n ${err}`
      );
    }
  }

  private async insertOne(element: MeliModel): Promise<void> {
    try {
      const obj: MeliModel = await this.repository.findOne({
        where: { id: element.id },
      });

      if (!obj) {
        this.repository.insert(element);
      }
      else {
        this.repository.update(obj, element);
      }
    } catch (err) {
      throw new Error(
        `Ocurrió un error al insertar los datos en ${MeliService.name} .\n  ${err}`
      );
    }
  }
}
