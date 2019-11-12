import {TLParser} from "../parser";


// Test
let file = "./media/BOSSNAME.LAYOUT";
// let scan: TLScan = new TLScan(file);
// scan.startScan();


let parser: TLParser = new TLParser(file);
parser.startParse();
l(parser.topNode.toString());
parser.writeToFile();

function l(...e) {
    console.log(e);
}