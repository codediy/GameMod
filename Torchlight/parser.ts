import { TLScan } from "./scan";
import {
    TLTokenKind,
    TLTagToken,
    TLValueToken,
    TLObject,
    TLType
} from "./node";

import * as fs from "fs";
import * as path from "path";

export class TLParser {
    public file: string;

    public scan: TLScan;
    public tokenIndex: number;

    public nodeStackLevel: number;
    public nodeStack: TLObject[];

    public currentNode: TLObject;
    public topNode: TLObject;

    constructor(file: string) {
        this.setFile(file);
    }

    public setFile(file: string) {
        this.file = file;
        this.scan = new TLScan(file);
        this.nodeStack = [];
        this.nodeStackLevel = 0;
    }

    public startParse() {
        this.scan.startScan();
        
        //索引
        this.tokenIndex = 0;
        if (this.scan.tokens.length > 0) {
            this.topNode = new TLObject(
                this.scan.tokens[0].name,
            );
            this.currentNode = this.topNode;
            this.tokenIndex = this.tokenIndex + 1;

            this.handleChildToken();
        }
        w(path.basename(this.file),this.topNode.toString());

        l(this.topNode.toString());
    }

    private handleChildToken() {
        let tokenLength = this.scan.tokens.length;

        let index = this.tokenIndex;
        if (index >= this.scan.tokens.length) {
            return;
        }
        // 第一个
        let i = index;
        let v = this.scan.tokens[i];

        let firstToken = this.scan.tokens[0];
        let nexToken: TLTagToken | TLValueToken | null;
        //属性处理
        if (v.name != firstToken.name) {

            if (i < tokenLength - 1) {
                nexToken = this.scan.tokens[i + 1];
            } else {
                nexToken = null;
            }

            // l("nextToken",nexToken);

            if (v.type == TLTokenKind.typeTag
                && nexToken
                && nexToken.type == TLTokenKind.value) { /* 属性值 */

                let typeNode = new TLType(
                    v.name,
                    (nexToken as TLValueToken).id,
                    (nexToken as TLValueToken).value
                );

                // l("typeNode",typeNode);

                this.currentNode.addPro(typeNode);
                this.tokenIndex = this.tokenIndex + 2;

            } else if (v.type == TLTokenKind.startTag) { /* 子属性开始标签 */
                let tempNode = new TLObject(
                    v.name
                );
                this.currentNode.addChild(tempNode); 
                this.tokenIndex = this.tokenIndex + 1; 

                this.pushNode(this.currentNode);
                this.currentNode = tempNode;        
            } else if( v.type == TLTokenKind.endTag) { /* 子属性结束标签 */
                this.currentNode = this.popNode();
                this.tokenIndex = this.tokenIndex + 1; 
                
            }
            
            this.handleChildToken();
        }
    }

    private pushNode(node: TLObject) {
        this.nodeStack.push(node);
        this.nodeStackLevel = this.nodeStackLevel + 1;
    }
    private popNode():TLObject {
        let node = this.nodeStack.pop();
        this.nodeStackLevel = this.nodeStackLevel - 1;
        return node;
    }

    get lastNode(): TLObject {
        return this.nodeStack[this.nodeStack.length - 1];
    }
}


// Test
let file = "./media/BOSSNAME.LAYOUT";
// let scan: TLScan = new TLScan(file);
// scan.startScan();


let parser: TLParser = new TLParser(file);
parser.startParse();

function l(...e) {
    console.log(e);
}

function w(file:string,content:string) {
    
    l(file);
    let dataFile = "./data/" + file.substring(0,file.indexOf('.'))+".json";
    l(dataFile);
    fs.writeFile(dataFile,content,(err)=>{
        console.log(err);
    });
}