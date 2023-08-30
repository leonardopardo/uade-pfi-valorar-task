import { CategoriesMapper } from "../mapper/CategoriesMapper";
import { MeliService } from "../services/MeliService";

export class MeliTask{
    private progressBar: any;
    private progressBarFormat: any;
    
    constructor(){
        const cliProgress = require('cli-progress');
        const colors = require('ansi-colors');

        this.progressBarFormat = {
            format: 'CLI Progress |' + colors.yellow('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }
        this.progressBar = new cliProgress.SingleBar({}, this.progressBarFormat);
    }

    // TODO: chango for real uses.
    public async run(): Promise<any> {
        try {
            const categries: Object[] = CategoriesMapper;
            const meliService: MeliService = new MeliService();
            let iterations:number = 0;
            let paging:number = 50;

            categries.forEach(async (category: any) => {
                let result = await meliService.get(category.meliCode);
                meliService.insert(result.results);
                let total = result.paging.total > 1000 ? 1000 : result.paging.total;
                
                iterations = Math.ceil(total / paging);
                
                this.progressBar.start(total, 50);

                for (let i = 1; i < iterations; i++) {
                    let offset = i * paging;
                    let result = await meliService.get(category.meliCode, offset, paging);
                    meliService.insert(result.results);
                    this.progressBar.update(offset);
                }

                this.progressBar.stop();
            })

        } catch (err) {
            console.log(err);
        }
    }
}