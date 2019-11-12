import * as glob from "glob";
import * as fs from "fs";
import {TLScan} from "./scan";


const gameDir = ".";
const mediaDir = gameDir+"/media/";

glob(mediaDir+"/*.LAYOUT",(err,files) => {

    let scan: TLScan;
    l(files);
    let tempFile = files[0];

    //解析处理
    if(scan){
        scan.setFile(tempFile);
    }else{
        scan = new TLScan(tempFile);
    }
    
    scan.startScan();
    l(scan.tokens);
    
})

function l(...e) {
    console.log(e);
}