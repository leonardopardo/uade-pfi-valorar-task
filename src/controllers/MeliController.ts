import { MeliTask } from './../tasks/MeliTask';
import { Request, Response } from "express";

export class MeliController {
  
  private meliTask: MeliTask;

  constructor() {
    this.meliTask = new MeliTask();
  }

  async index(req: Request, res: Response): Promise<any> {
    try {
      this.meliTask.run();
      res.status(200).send(`${MeliController.name} works!`);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
