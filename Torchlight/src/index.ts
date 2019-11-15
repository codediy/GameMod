import { TLMedia } from "./media";
import { l } from "./util";
import { TLParser } from "./parser";

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

    public handleRoot(dir: string,toDir?:string) {
        this._m.setDir(dir);
        if(toDir){
            this._m.setToDir(toDir);
        }
        this._m.getChild();
        this._m.writeDir();
        this._m.parseFiles();
    }

    public handleDir(dir: string,toDir?:string) {
        this.handleRoot(dir);

        this._m.getAllFiles();
        this._m.writeFiels();
    }

    //单独的子目录处理
    public handleChildDir(dir: string,toDir?:string) {
        this.handleDir(dir,toDir || null);
        
        this._m.getAllFiles();
        this._m.writeFiels();
        this._m.parseAllFiles();
    }

    // 根目录文件
    static mediaRoot()
    {
        let toDir = "../data/media/";
        let tl = new TL();
        tl.handleRoot(mediaDir);
    }


    //echoPass数据
    static echoPass() {
        let toDir = "../data/echopass/";
        let echoPassFile = "E:\\TL\\MEDIA\\DUNGEONS\\ECHOPASS.DAT";
        let p = new TLParser(echoPassFile);

        //dungeon
        p.startParse();
        p.writeToFile(toDir);

        // rule
        let ruleFile = "E:\\TL\\MEDIA\\LAYOUTS\\ACT1_PASS1\\RULES.TEMPLATE";

        p.setFile(ruleFile);
        p.startParse();
        p.writeToFile(toDir);

        // mainmenu

        let menuFile = "E:\\TL\\MEDIA\\LAYOUTS\\MAINMENUS\\MAINMENU_TOWNRULES.TEMPLATE";

        p.setFile(menuFile);
        p.startParse();
        p.writeToFile(toDir);

        // env
        let l2File    = "E:\\TL\\MEDIA\\LAYOUTS\\MAINMENUS\\ENVIRONMENT.LAYOUT"

        p.setFile(l2File);
        p.startParse();
        p.writeToFile(toDir);

        let envFile   = "E:\\TL\\MEDIA\\LAYOUTS\\ACT1\\ENVIRONMENT_PASS1.LAYOUT";

        p.setFile(envFile);
        p.startParse();
        p.writeToFile(toDir);

        // 目录处理
        let passDir = "E:\\TL\\MEDIA\\LAYOUTS\\ACT1_PASS1\\1X1SINGLE_ROOM_A";
        let tl = new TL();
        tl.handleChildDir(passDir,toDir);
    }


}

TL.mediaRoot();
// TL.echoPass();



