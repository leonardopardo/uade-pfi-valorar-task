import * as exec from "child_process";
import { timeStamp } from "console";
import { writeFileSync } from "fs";
import * as path from "path";


export class SentimentTask {
    private path: string;

    constructor() {
      this.path = path.resolve(__dirname);
    }
  
    async run(): Promise<any> {
      try {
        
        console.log(`> execute sentiment service... | ${new Date()}`)
  
        const timestamp = new Date().getTime();
    
        const result = exec.execSync(
          `python3 ${this.path}/python/sentiment_processor.py`
        );
        
        return result.toString();
      } catch (err) {
        console.log(err);
      }
    }
}
