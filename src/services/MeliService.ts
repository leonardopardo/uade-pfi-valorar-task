import * as fetch from "node-fetch";
import { MongoDatasource } from "../MyDataSoure";
import { DataSource, Repository } from "typeorm";
import { MeliModel } from "../models/MeliModel";

export class MeliService {
  private baseUrl: string = process.env.SERVICE_MELI_BASE_PATH;

  private city: string = process.env.SERVICE_MELI_CITY;

  private ds: DataSource = MongoDatasource;

  private repository: Repository<MeliModel>;

  private elements: MeliModel[];

  constructor() {
    this.repository = this.ds.getRepository(MeliModel);
    this.elements = [];
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

  public async insert(list: any[]): Promise<void> {
    try {
      list.forEach(async (element: MeliModel) => {
        const obj: MeliModel = await this.repository.findOne({
          where: { id: element.id },
        });
        if (!obj) {
          await this.repository.insert(element);
        } else {
          await this.repository.update(obj, element);
        }
      });
    } catch (err) {
      throw new Error(
        "Ocurrió un error al insertar los datos de Meli.\n" + err
      );
    }
  }
}
