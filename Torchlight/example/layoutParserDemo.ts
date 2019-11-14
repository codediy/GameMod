import {TLParser} from "../src/parser";


// Test
let file = "E:/TL/MEDIA/LAYOUTS/ACT1/1X1_CLIFF_CONCAVE_N1E2/1X1_CLIFF_CONCAVE_N1E2_TOWER_JT_A.LAYOUT";
// let scan: TLScan = new TLScan(file);
// scan.startScan();


let parser: TLParser = new TLParser(file);
parser.startParse();
l(parser.topNode.toString());
parser.writeToFile();

function l(...e) {
    console.log(e);
}