import * as glob from "glob";
import { TLParser } from "./parser";


const gameDir = ".";
const mediaDir = gameDir + "/media/";

let exts = ["LAYOUT","DAT"];

exts.forEach((v,i,[])=>{
    parser(v);
})

function parser(ext: String) {
    glob(mediaDir + "/*." + ext, (err, files) => {

        if (err) {
            throw err;
        }

        if (files.length > 0) {
            let parser = new TLParser(files[0]);
            parser.startParse();
            parser.writeToFile();
            for (let i = 1; i < files.length; i++) {
                parser.setFile(files[i]);
                parser.writeToFile();
            }
        }
    })
}



