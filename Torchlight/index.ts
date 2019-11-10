import * as glob from "glob";
import * as fs from "fs";

/* 正则匹配 */
const TL_TYPE = [
    "BOOL",

    "UNSIGNED INT",
    "INTEGER",
    "INTEGER64",

    "FLOAT",
    "STRING",
];

const TL_TAG = [
    "LAYOUT",
    "OBJECTS",
    "BASEOBJECT",
    "PROPERTIES",
    "LOGICGROUP",
    "LOGICOBJECT"
];

const TL_REG = [];
TL_TAG.forEach((v,i,[])=>{
    TL_REG.push(`\[${v}\]`);
    TL_REG.push(`\[/${v}\]`);
});
TL_TYPE.forEach((v,i,[])=>{
    TL_REG.push(`\[${v}\]`);
})

console.log(TL_REG);

const gameDir = "E:/Steam/steamapps/common/Torchlight II";
const mediaDir = gameDir+"/MEDIA/";
const ENCODE = 'utf-8';

glob(mediaDir+"/*.LAYOUT",(err,files) => {
    
    for (const tempFile of files) {
        
    }

})

let tempFile = mediaDir+"BOSSMUSIC.LAYOUT"; 

// layoutFileHandle(tempFile);

function layoutFileHandle(file:string){
    fs.readFile(file,ENCODE,(err,c) => {
        if(err){

        }else{
            console.log(c);
        }
    })   
}