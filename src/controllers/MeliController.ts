import { Request, Response } from "express";
import { MeliService } from "../services/MeliService";

export class MeliController {
  async index(req: Request, res: Response): Promise<any> {
    try {
        const category = 'MLA1466';
        const meliService = new MeliService();
        const result = await meliService.get(category, 1500, 50);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
  }
}
