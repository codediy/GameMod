/* 
MEDIA目录文件读取
*/
import * as fs from "fs";
import * as path from "path";
import { l, p } from "./util";

interface TLMediaFile {
    dir: string,
    layout: string[],
    dat: string[]
}

interface TLMediaFiles {
    [key:string]:TLMediaFile
}


class TLMedia {
    //Medial根目录
    public _dir: string;
    //结果对象
    public _files: TLMediaFiles;

    public _level: number;
    //支持的文件后缀
    public _ext = [
        ".LAYOUT",
        ".DAT"
    ];

    constructor(
        dir: string
    ) {
        this._dir = dir;
        this._level = 0;
        this._files = {};
    }
    /* 递归获取文件名 */
    getFiles() {
        this.handleDir(this._dir);
        l(this._files);
    }

    handleDir(dir: string) {
        this._level = this._level + 1;

        let files = fs.readdirSync(dir);

        files.forEach((v, i) => {
            let fPath = path.join(dir, v);
            let stat = fs.statSync(fPath);

            if (stat.isFile() === true) { /* 文件处理 */
                this.handleFile(fPath);
            }
            if (stat.isDirectory() === true) { /* 子目录处理 */
                this.handleDir(fPath);
                //this.tryHandleDir(fPath);
            }
        });
        
    }
    
    handleFile(file: string) {
        if (this._ext.indexOf(path.extname(file)) > -1) {
            this.pushFiles(file);
        }
    }
    pushFiles(file: string) {
        let dir = path.dirname(file).replace(/\\/g,"_").replace(":","");
        
        if(!Object.prototype.hasOwnProperty.call(this._files,dir)){
            this._files[dir] = {
                dir:path.dirname(file),
                layout:[],
                dat:[]
            };
        }
        //获取根目录
        let field = path.extname(file).toLowerCase().replace(".", "") as "layout" | "dat";
        this._files[dir][field].push(path.basename(file));
    }

    writeToFile() {

    }

}


//Test
let dir = "E:\\TL\\MEDIA";
let m = new TLMedia(dir);
m.getFiles();
