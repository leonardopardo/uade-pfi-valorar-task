import * as fetch from "node-fetch";
import { MongoDatasource } from "../MyDataSoure";
import { DataSource, Repository } from "typeorm";
import { MeliTokenModel } from "../models/MeliTokenModel";

export class MeliTokenService {
  private baseUrl: string = process.env.SERVICE_MELI_BASE_PATH;

  private city: string = process.env.SERVICE_MELI_CITY;

  private ds: DataSource = MongoDatasource;

  private repository: Repository<MeliTokenModel>;x

  constructor() {
    this.repository = this.ds.getRepository(MeliTokenModel);
  }

  async getToken(): Promise<MeliTokenModel> {
    try {
      const token: any = await this.repository.findOne({
        where: { user_id: parseInt(process.env.SERVICE_MELI_USER_ID) },
      });

      return token;
    } catch (err) {
      throw new Error(
        `Ocurrió un error en ${MeliTokenService.name} al obtener los datos de Meli.\n ${err}`
      );
    }
  }

  async refreshToken(): Promise<MeliTokenModel> {
    try {
      const token = await this.getToken();

      const service = `https://api.mercadolibre.com/oauth/token`;

      const response = await fetch(service, {
        method: "POST",
        body: JSON.stringify({
          grant_type: "refresh_token",
          client_id: process.env.SERVICE_MELI_APP_ID,
          client_secret: process.env.SERVICE_MELI_CLIENT_SECRET,
          refresh_token: token.refresh_token,
        }),
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      const data = await response.json();

      if (response.status !== 200)
        throw new Error(
          `Ocurrió un error en ${MeliTokenService.name} al querer obtener nuevo token de Meli.\n ${data.message}`
        );

      token.access_token = data.access_token;
      token.expires_in = data.expires_in;
      token.refresh_token = data.refresh_token;

      await this.repository.update(token.user_id, token);

      return token;
    } catch (err) {
      throw new Error(
        `Ocurrió un error en ${MeliTokenService.name} al obtener los datos de Meli.\n ${err}`
      );
    }
  }
}
