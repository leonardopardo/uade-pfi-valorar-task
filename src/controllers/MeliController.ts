import { MeliProcessorTask } from '../tasks/MeliProcessorTask';
import { MeliTask } from './../tasks/MeliTask';
import { Request, Response } from "express";

export class MeliController {
  
  private meliTask: MeliTask;
  private meliProcessorTask: MeliProcessorTask

  constructor() {
    this.meliTask = new MeliTask();
    this.meliProcessorTask = new MeliProcessorTask()
  }

  async index(req: Request, res: Response): Promise<any> {
    try {
      this.meliTask.run();
      res.status(200).send(`${MeliController.name} works!`);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async process(req: Request, res: Response): Promise<any> {
    try {
      await this.meliProcessorTask.run();
      res.status(200).send(`${MeliController.name} works!`);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
