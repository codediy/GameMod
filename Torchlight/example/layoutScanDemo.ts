
import { TLScan } from "../src/scan";


// Test
let file = "E:/TL/MEDIA/GLOBALS.DAT";
// let scan: TLScan = new TLScan(file);
// scan.startScan();


let scan: TLScan = new TLScan(file);
scan.startScan();
scan.writeToFile();



function l(...e) {
    console.log(e);
}