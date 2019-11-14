import { TLMedia } from "./media";

const gameDir = "E:\\TL\\";
const mediaDir = gameDir + "MEDIA";

//1 地图
const layoutDir = mediaDir + "\\LAYOUTS";
const levelSetDir = mediaDir + "\\LEVELSETS";
const levelSetAliaseDir = mediaDir + "\\LEVELSETALIASES";
const levelThemesDir = mediaDir + "\\LEVELTHEMES";
const dungeonsDir = mediaDir + "\\DUNGEONS";
const wayPointsDir = mediaDir + "\\WAYPOINTS";

//2 任务
const questDir = mediaDir + "\\QUESTS";

//3 单位
const unitDir = mediaDir + "\\UNITS";
const unitTypesDir = mediaDir + "\\UNITTYPES";
const unitThemesDir = mediaDir + "\\UNITTHEMES";

//4 技能
//5 物品 
//特效
const affixesDir = mediaDir + "\\AFFIXES";


// TL处理核心
export class TL {
    public _m: TLMedia;

    constructor() {
        this._m = new TLMedia(".");
    }

    public handleRoot(dir: string) {
        this._m.setDir(dir);
        this._m.getChild();
        this._m.writeDir();
    }

    public handleDir(dir: string) {
        this.handleRoot(dir);
        
        this._m.getAllFiles();
        this._m.writeFiels();
    }


    static mapData()
    {
        let tl = new TL();
        tl.handleDir(layoutDir);
        // tl.handleDir(levelSetDir);
        // tl.handleDir(levelSetAliaseDir);
        // tl.handleDir(levelThemesDir);
        // tl.handleDir(dungeonsDir);
        // tl.handleDir(wayPointsDir);
    }

}

TL.mapData();



