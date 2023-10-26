import * as exec from "child_process";
import { timeStamp } from "console";
import { writeFileSync } from "fs";
import * as path from "path";


export class MeliProcessorTask {
    private path: string;

    constructor() {
      this.path = path.resolve(__dirname);
    }
  
    async run(): Promise<any> {
      try {
        
        console.log(`> execute meli processor service... | ${new Date()}`)
  
        const timestamp = new Date().getTime();
    
        const result = exec.execSync(
          `python3 ${this.path}/python/meli_processor.py`
        );
        
        console.log(result.toString())

        return result.toString();
      } catch (err) {
        console.log(err);
      }
    }
}
