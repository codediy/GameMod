import { TLScan } from "./scan";
import {
    TLTokenKind,
    TLTagToken,
    TLValueToken,
    TLObject,
    TLType
} from "./node";

import { l } from "./util";

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
        this.scan = new TLScan(".");
        this.setFile(file);
    }

    public setFile(file: string) {
        this.file = file;
        this.scan.setFile(file);
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

            while (true) {
                this.handleChildToken();
                if (this.tokenIndex === this.scan.tokens.length - 1) {
                    break;
                }
            }
        }

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
        let nextToken: TLTagToken | TLValueToken | null;

        //属性处理
        if (v.name != firstToken.name) {

            if (i < tokenLength - 1) {
                nextToken = this.scan.tokens[i + 1];
            } else {
                nextToken = null;
            }

            //l("nextToken",nexToken);
            if (v.type == TLTokenKind.typeTag
                && nextToken) { /* 属性值 */

                let nextIndex = i + 1;
                    
                //读取到值 //GLOBALS.DAT bug
                while (nextToken.type !== TLTokenKind.value) {
                    nextIndex = nextIndex + 1;
                    nextToken = this.scan.tokens[nextIndex];
                    this.tokenIndex = this.tokenIndex + 1;
                }

                let typeNode = new TLType(
                    v.name,
                    (nextToken as TLValueToken).id,
                    (nextToken as TLValueToken).value
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

            } else if (v.type == TLTokenKind.endTag) { /* 子属性结束标签 */
                this.currentNode = this.popNode();
                this.tokenIndex = this.tokenIndex + 1;
            }
        }
    }

    private pushNode(node: TLObject) {
        this.nodeStack.push(node);
        this.nodeStackLevel = this.nodeStackLevel + 1;
    }
    private popNode(): TLObject {
        let node = this.nodeStack.pop();
        this.nodeStackLevel = this.nodeStackLevel - 1;
        return node;
    }

    get lastNode(): TLObject {
        return this.nodeStack[this.nodeStack.length - 1];
    }

    public writeToFile(toDir?: string) {
        let dir = toDir || "../data"
        let file = path.basename(this.file);
        let content = this.topNode.toString();
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let dataFile = dir + "/" + file.substring(0, file.indexOf('.')) + ".json";

        fs.writeFileSync(dataFile, content);
        
        l(file, "解析完成...");
    }
}



