import { Router } from "express";
import { SentimentController } from "../controllers/SentimentController";

export class SentimentRouter {
  private controller: SentimentController;
  private prefix: string = "/sentiment";

  constructor() {
    this.controller = new SentimentController();
  }

  public routes(router: Router): void {
    router.get(`${this.prefix}/tasks/run`, this.controller.index);
  }
}
