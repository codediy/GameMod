import * as glob from "glob";
import { TLParser } from "./parser";


const gameDir = ".";
const mediaDir = gameDir + "/media/";

let exts = ["LAYOUT","DAT"];

exts.forEach((v,i,[])=>{
    parser(v);
})

/* 解析目录 */
function parser(ext: string,
    dir?:string
) {
    let tempDir = dir 
        ? mediaDir + dir + "/*." + ext
        :  mediaDir + "/*." + ext
        
    glob(tempDir, (err, files) => {

        if (err) {
            throw err;
        }

        if (files.length > 0) {
            let parser = new TLParser(files[0]);
            parser.startParse();
            parser.writeToFile();

            for (let i = 1; i < files.length; i++) {
                parser.setFile(files[i]);
                
                parser.startParse();
                parser.writeToFile();
            }
        }
    })
}




