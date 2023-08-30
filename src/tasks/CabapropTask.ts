export class CabapropTask{
    private progressBar: any;
    private progressBarFormat: any;
    
    constructor(){
        const cliProgress = require('cli-progress');
        const colors = require('ansi-colors');

        this.progressBarFormat = {
            format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }
        this.progressBar = new cliProgress.SingleBar({}, this.progressBarFormat);
    }

    // TODO: chango for real uses.
    public async run(): Promise<any> {
        try {
            this.progressBar.start(100, 0);
            for (let i = 0; i <= 100; i++) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                this.progressBar.update(i);
            }
            this.progressBar.stop();
        } catch (err) {
            console.log(err);
        }
    }
}