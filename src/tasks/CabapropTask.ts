import { CabapropService } from "../services/CabapropService";

export class CabapropTask{
    private colors: any;
    private progressBar: any;
    private progressBarFormat: any;
    
    constructor(){
        const cliProgress = require('cli-progress');
        const colors = require('ansi-colors');
        this.colors = colors;

        this.progressBarFormat = {
            format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }
        this.progressBar = new cliProgress.SingleBar({}, this.progressBarFormat);
    }

    /**
     * Run the CabapropTask
     */
    public async run(): Promise<any> {
        try {

            const service = new CabapropService();
            
            const result = await service.get();
            
            if (!result) throw new Error(`Ocurrió un error al obtener los datos de Cabaprop.`);

            service.insert(result.result);

            const total = result.allPropertiesLength;

            const limit = 12;

            const iterations = Math.ceil(total / limit);

            this.progressBar.start(total, 0);

            for(let i = 1; i < iterations; i++) {

                const result = await service.get(i, limit);

                service.insert(result.result);
              
                this.progressBar.update(i*limit);
            }

            this.progressBar.stop();

            console.log(this.colors.green("\n CABAPROP IMPORT FINALIZADO"));

        } catch (err) {
            throw new Error(`Ocurrió un error en ${CabapropTask.name}.\n ${err}`);
        }
    }
}