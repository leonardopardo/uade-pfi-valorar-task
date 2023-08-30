import { Router } from "express";
import { CabapropController } from "../controllers/CabapropController";

export class CabapropRouter {
  private controller: CabapropController;
  private prefix: string = "/cabaprop";

  constructor() {
    this.controller = new CabapropController();
  }

  public routes(router: Router): void {
    router.get(`${this.prefix}`, this.controller.index);
  }
}
