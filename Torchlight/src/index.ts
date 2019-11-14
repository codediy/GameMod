import { TLMedia } from "./media";

const gameDir = "E:\\TL\\";
const mediaDir = gameDir + "MEDIA";
//地图
const dungeonsDir = mediaDir + "\\DUNGEONS";
//特效
const affixesDir = mediaDir + "\\AFFIXES";


// TL处理核心
export class TL{
    public _m:TLMedia;

    constructor(){
        this._m = new TLMedia(".");
    }

    public  handleRoot(dir:string) {
        this._m.setDir(dir);
        this._m.getChild();
        this._m.writeDir();
    }

    public handleDir(dir:string){
        this.handleRoot(dir);
        this._m.getAllFiles();
        this._m.writeFiels();
    }


}


let tl = new TL();
tl.handleRoot(mediaDir);
// tl.handleDir(dungeonsDir);



