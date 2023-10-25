import { CategoriesMapper } from "../mapper/CategoriesMapper";
import { MeliService } from "../services/MeliService";

export class MeliTask {
  private colors: any;
  private progressBar: any;
  private progressBarFormat: any;

  constructor() {
    const cliProgress = require("cli-progress");
    const colors = require("ansi-colors");
    this.colors = colors;

    this.progressBarFormat = {
      format: `MELI IMPORT | Progress [{bar}] | {percentage}% | {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    };
    this.progressBar = new cliProgress.SingleBar({}, this.progressBarFormat);
  }

  /**
   * Run the MeliTask
   */
  public async run(): Promise<void> {
    try {

      const categries: any = CategoriesMapper;

      const meliService: MeliService = new MeliService();

      let iterations: number = 0;

      let limit: number = 50;

      for (let i = 0; i < categries.length; i++) {

        const meliCode = categries[i]['meliCode'];
        
        const meliCate = categries[i]['category'];

        let result = await meliService.get(meliCode);

        if (!result.results) throw new Error(`Ocurrió un error al obtener los datos de Meli.`);
          
        meliService.insert(result.results);

        let total = result.paging.total; //> 1000 ? 1000 : result.paging.total;

        iterations = Math.ceil(total / limit);

        this.progressBar.start(total, 0);

        for (let i = 1; i <= iterations; i++) {

          let offset = i * limit;

          let result = await meliService.get(meliCode, offset, limit);

          if (result.results?.length > 0)
            meliService.insert(result.results);

          this.progressBar.update(offset);
        }

        console.log(this.colors.blue(` | CATEGORIA ${meliCate} FINALIZADA`));

      }

      this.progressBar.stop();

      console.log(this.colors.green("\n MELI IMPORT FINALIZADO"));

    } catch (err) {

      throw new Error(
        `Ocurrió un error en ${MeliTask.name} para inserción en los datos de Meli. \n ${err.message}`
      );

    }
  }
}
