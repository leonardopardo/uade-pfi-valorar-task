import { CategoriesMapper } from "../mapper/CategoriesMapper";
import { MeliService } from "../services/MeliService";

export class MeliTask {
  private progressBar: any;
  private progressBarFormat: any;

  constructor() {
    const cliProgress = require("cli-progress");
    const colors = require("ansi-colors");

    this.progressBarFormat = {
      format: `MELI IMPORT | Progress {bar} | {percentage}% | {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    };
    this.progressBar = new cliProgress.SingleBar({}, this.progressBarFormat);
  }

  // TODO: chango for real uses.
  public async run(): Promise<void> {
    try {
      const categries: Object[] = CategoriesMapper;

      const meliService: MeliService = new MeliService();

      let iterations: number = 0;

      let limit: number = 50;

      let result = await meliService.get("MLA1467");

      await meliService.insert(result.results);

      //   let total = result.paging.total > 1000 ? 1000 : result.paging.total;

      //   iterations = Math.ceil(total / limit);

      //   this.progressBar.start(total, 0);

      //   for (let i = 1; i <= iterations; i++) {
      //     let offset = i * limit;
      //     let result = await meliService.get("MLA1467", offset, limit);

      //     if (result.results?.length > 0)
      //       await meliService.insert(result.results);

      //     this.progressBar.update(offset);
      //   }

      //   this.progressBar.stop();
    } catch (err) {
      throw new Error(
        `Ocurrió un error en ${MeliTask.name} para inserción en los datos de Meli. \n ${err}`
      );
    }
  }
}
