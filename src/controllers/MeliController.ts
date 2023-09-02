import { Request, Response } from "express";

export class MeliController {
  async index(req: Request, res: Response): Promise<any> {
    try {
      res.status(200).send(`${MeliController.name} works!`);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
