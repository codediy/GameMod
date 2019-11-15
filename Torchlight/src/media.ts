/* 
MEDIA目录文件读取
*/
import * as fs from "fs";
import * as path from "path";
import { l, p } from "./util";
import { TLParser } from "./parser";

interface TLMediaFile {
    dir: string,
    layout: string[],
    dat: string[]
}

interface TLMediaFiles  {
    [key: string]: TLMediaFile
}


export class TLMedia {
    // Medial根目录
    public _dir: string;
    public _toDir:string;

    // 子文件数组
    public _files: string[];
    // 子目录数组
    public _dirs: string[];
    // 递归子文件数组
    public _allFiles: TLMediaFiles;

    public _level: number;

    //支持的文件后缀
    public _ext = [
        ".LAYOUT",
        ".DAT",
        ".TEMPLATE"
    ];

    public _ignoreFile = [
        "TAGS.DAT"
    ];

    //解析器
    public _parser:TLParser;
    constructor(
        dir: string
    ) {
        this.setDir(dir);
    }

    setDir(
        dir: string
    ) {
        this._dir = dir;
        //数据生成目录
        this._toDir = "../data/"+path.basename(this._dir);
        if(!fs.existsSync(this._toDir)){
            fs.mkdirSync(this._toDir);
        }

        this._level = 0;
        this._dirs = [];
        this._files = [];
        this._allFiles = {};

        this._parser = new TLParser(".");
    }
    setToDir( dir: string){
        this._toDir = dir;
    }
    
    getChild(){
        this.getDirs();
        this.getFiles();
    }
    //获取子目录信息
    getDirs() {
        let files = fs.readdirSync(this._dir);

        files.forEach((v, i) => {
            let fPath = path.join(this._dir, v);
            let stat = fs.statSync(fPath);

            if (stat.isDirectory() === true) { /* 子目录处理 */
                this._dirs.push(v);
            }
        });
    }

    //读取子文件信息
    getFiles() {
        let files = fs.readdirSync(this._dir);

        files.forEach((v, i) => {
            let fPath = path.join(this._dir, v);
            let stat = fs.statSync(fPath);

            if (stat.isFile() === true) { /* 文件处理 */
                //检查后缀
                if (this._ext.indexOf(path.extname(v)) > -1) {
                    this._files.push(v);
                }
            }
        });

    }

    getAllFiles() {
        this.handleDir(this._dir);
    }

    // 获取递归文件信息
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
            }
        });

    }

    handleFile(file: string) {
        if (this._ext.indexOf(path.extname(file)) > -1 
            && this._ignoreFile.indexOf(path.basename(file)) == -1
        ) {
            this.pushFiles(file);
        }
    }

    pushFiles(file: string) {
        let dir = path.dirname(file).replace(/\\/g, "_").replace(":", "");
        
        if (!Object.prototype.hasOwnProperty.call(this._allFiles, dir)) {
            this._allFiles[dir] = {
                dir: path.dirname(file),
                layout: [],
                dat: []
            };
        }

        //获取根目录
        let field = path.extname(file).toLowerCase().replace(".", "") as "layout" | "dat";
        this._allFiles[dir][field].push(path.basename(file));
    }

    writeDir() {
        let rootFile = "0_"+path.basename(this._dir)+".json";
       
        fs.writeFile(this._toDir+"/"+rootFile,this.childToString(),(err)=>{
            if(err){
                throw err;
            }
            //提示写入成功
            l(this._dir,"目录信息获取成功");
        });
        
    }
    writeFiels()
    {
        let rootFile = "1_"+path.basename(this._dir)+".json";
        fs.writeFile(this._toDir+"/"+rootFile,this.allFilesToString(),(err)=>{
            if(err){
                throw err;
            }
            //提示写入成功
            l(this._dir,"文件信息获取成功");
        });
    }

    // 解析子目录文件
    parseFiles()
    {
        this._files.forEach((v,i) => {
            this.parseFile(path.join(this._dir,v));
        })
    }

    // 递归解析所有文件
    parseAllFiles()
    {   
        //生成各个文件的内容
        Object.keys(this._allFiles).forEach((v,i) => {
            this.parseMediaFiles(this._allFiles[v]);
        });
    }
    parseMediaFiles(mediaFiles:TLMediaFile)
    {  
        if(mediaFiles.dat.length > 0){
            mediaFiles.dat.forEach((v,i)=>{
                this.parseFile(path.join(mediaFiles.dir,v));
            })
        }
        if(mediaFiles.layout.length > 0){
            mediaFiles.layout.forEach((v,i)=>{
                this.parseFile(path.join(mediaFiles.dir,v));
            })
        }
    }
    private parseFile(file:string)
    {   //检查文件合法
        if (this._ext.indexOf(path.extname(file)) > -1 
            && this._ignoreFile.indexOf(path.basename(file)) == -1
        ) {
            this._parser.setFile(file);
            this._parser.startParse();
            this._parser.writeToFile(this._toDir +"/");
        }
    }
    childToString(){

        return JSON.stringify({
            "dirs":this._dirs,
            "files":this._files
        },null,"\t");
    }
    allFilesToString(){
        return JSON.stringify(this._allFiles,null,"\t");
    }

    f() {
        p(this._files);
    }
    d() {
        p(this._dirs);
    }
    a() {
        p(this._allFiles);
    }
}


