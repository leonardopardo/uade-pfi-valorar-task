import { SentimentTask } from "../tasks/SentimentTask";
import { Request, Response } from "express";

export class SentimentController {
  
  private sentimentTask: SentimentTask;

  constructor() {
    this.sentimentTask = new SentimentTask();
  }

  async index(req: Request, res: Response): Promise<any> {
    try {
      res.status(200).send(`${SentimentController.name} works!`);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
