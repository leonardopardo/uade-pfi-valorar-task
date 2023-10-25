import * as fetch from "node-fetch";
import { DataSource, ObjectId, Repository } from "typeorm";
import { MongoDatasource } from "../MyDataSoure";
import { off } from "process";
import { cabapropObject } from "../config/config";
import { CabapropModel } from "../models/CabapropModel";
export class CabapropService {
  private baseUrl: string = process.env.SERVICE_CABAPROP_BASE_PATH;

  private ds: DataSource = MongoDatasource;

  private repository: Repository<CabapropModel>;

  constructor() {
    this.repository = this.ds.getRepository(CabapropModel);
  }

  /**
   * Obtiene los datos de Cabaprop.
   * @param offset
   * @param limit
   * @returns Promise<any>
   */
  async get(offset: number = 0, limit: number = 12): Promise<any> {
    try {
      const path = `${this.baseUrl}offset=${offset}&limit=${limit}&orderBy=created_at&sort=desc`;

      const response = await fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(cabapropObject),
      });

      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Inserta un listado de elementos en la base de datos.
   * @param list
   */
  async insert(list: CabapropModel[]): Promise<any> {
    try {
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        this.insertOne(element);
      }
    } catch (err) {
      throw new Error(
        `Ocurrió un error al insertar los datos de ${CabapropService.name}.\n ${err}`
      );
    }
  }

  /**
   * Inserta un elmento en la base de datos.
   * @param element
   */
  async insertOne(element: CabapropModel): Promise<any> {
    try {
      const obj = await this.repository.findOne({
        where: {
          _id: element._id,
        },
      });

      if (!obj) {
        this.repository.insert(element);
      } else {
        this.repository.update(element._id, element);
      }
    } catch (err) {
      throw new Error(
        `Ocurrió un error al insertar los datos de ${CabapropService.name}.\n ${err}`
      );
    }
  }
}
