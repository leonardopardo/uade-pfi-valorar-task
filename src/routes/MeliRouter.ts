import { Router } from "express";
import { MeliController } from "../controllers/MeliController";

export class MeliRouter {
  private controller: MeliController;
  private prefix: string = "/meli";

  constructor() {
    this.controller = new MeliController();
  }

  public routes(router: Router): void {
    router.get(`${this.prefix}/tasks/run`, this.controller.index);
    router.get(`${this.prefix}/tasks/process`, this.controller.process);
  }
}
