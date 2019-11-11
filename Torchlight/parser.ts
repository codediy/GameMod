import * as fs from "fs";
import { stringify } from "querystring";
import { TlsOptions } from "tls";

const enum TLTokenKind {
    startTag, /* 普通标签 */
    endTag,   /* 结束标签 */
    typeTag,  /* 类型标签 */
    value,    /* 值内容 */
}

/* 标签类型 */
const enum TLTagType {
    start,
    end
}

interface TLPosition {
    start: number,
    end: number
}

/* 标签 */
class TLTag {
    public commonNode = [
        "LAYOUT",
        "OBJECTS",
        "BASEOBJECT",
        "PROPERTIES",
    ];
    public commonType = [
        "BOOL",

        "UNSIGNED INT",
        "INTEGER",
        "INTEGER64",

        "FLOAT",
        "STRING",
    ];

    public startTagLeft = '[';
    public endTagLeft = '/';

    public tagRight = ']';

    public typeTagLeft = '<';
    public typeTagRight = '>';

    public valueSplit = ":";
}

/* 解析器 */
export class TLScan {
    public file: string;
    public row: number;

    public col: number;
    public offset: number;

    public content: string;

    public _tokens: TLToken[];
    public tag: TLTag;
    public encode: string;

    public constructor(file: string) {
        this.file = file;

        this.row = 1;
        this.col = 1;
        this.offset = 1;

        this._tokens = [];
        // 文件编码
        this.setEncode("utf-16LE");
        // 标签配置
        this.tag = new TLTag();
    }

    //重置file
    public setFile(file: string) {
        this.file = file;
        this.row = 1;
        this.col = 1;
        this.offset = 1;

        this._tokens = [];
    }

    public setEncode(encode: string) {
        this.encode = encode;
    }

    get tokens() {
        return this._tokens;
    }

    //生成Token
    public startScan() {
        //读取文件内容
        fs.readFile(this.file, this.encode, (err, c) => {
            if (err) {
                return;
            }
            this.content = c.trim();
            this.handleContent();
        });
    }

    private handleContent() {
        while (this.content.length > 0) {
            if (this.content[0] == /* [ */ this.tag.startTagLeft) {
                if (this.content[1] == "/") {
                    /* 结束标签 */
                    this.handleTag(TLTagType.end);
                } else {
                    /* 开始标签 */
                    this.handleTag(TLTagType.start);
                }
            }
            else if (this.content[0] == /* < */ this.tag.typeTagLeft) {
                /* 普通属性 */
                this.handleTypeTag();
            }
        }
    }

    private handleTag(type: TLTagType) {
        //解析内容
        let startTag: number,
            endTag: number;
        //token 
        let tempTagToken = new TLTagToken();

        //读取标签
        startTag = this.content.indexOf(this.tag.startTagLeft);
        endTag = this.content.indexOf(this.tag.tagRight);

        if (startTag > -1 && endTag > -1) {
            /* 
            substr(start,length) 截取[start,start+length]
            substring(start,end) 截取[start,end)
            */
            tempTagToken.initToken(
                type === TLTagType.start
                    ? TLTokenKind.startTag
                    : TLTokenKind.endTag,
                type === TLTagType.start
                    /* [(.*)] */
                    ? this.content.substring(startTag + 1, endTag)
                    /* [/(.*)] */
                    : this.content.substring(startTag + 2, endTag),
                this.file,
                this.offset,
                this.offset + endTag - startTag,
                this.content.substring(startTag, endTag + 1)
            );
            this._tokens.push(tempTagToken);
            this.skip(endTag + 1);
            this.skipSpace();

        }
    }

    private handleTypeTag() {
        //解析内容
        let startTag: number,
            endTag: number;
        //token 
        let tempTagToken = new TLTagToken();

        //读取标签
        startTag = this.content.indexOf(this.tag.typeTagLeft);
        endTag = this.content.indexOf(this.tag.typeTagRight);

        if (startTag > -1 && endTag > -1) {
            /* 
            substr(start,length) 截取[start,start+length]
            substring(start,end) 截取[start,end)
            */
            /* <(.*)> */
            tempTagToken.initToken(
                TLTokenKind.startTag,
                this.content.substring(startTag + 1, endTag),
                this.file,
                this.offset,
                this.offset + endTag - startTag,
                this.content.substring(startTag, endTag + 1)
            );
            this._tokens.push(tempTagToken);
            this.skip(endTag + 1);
            this.skipSpace();

            //进入循环
            this.handleValue();
        }
    }

    private handleValue() {
        //解析内容
        let startTag = 0,
            endTag: number;
        //token 
        let tempTagToken = new TLValueToken();

        for (let i = 0; i < this.content.length; i++) {
            if (String.fromCharCode(10) === this.content[i]) {
                endTag = i;
                break;
            }
        }

        if (endTag) {
            let temp = this.content.substring(startTag, endTag).trim();
            endTag = startTag + temp.length - 1;
            let valueContent = temp.split( /* : */this.tag.valueSplit);
            if (valueContent.length == 2) {
                tempTagToken.initToken(
                    this.file,
                    this.offset,
                    this.offset + endTag - startTag,
                    temp,
                    valueContent[0],
                    valueContent[1]
                );
            }
            this._tokens.push(tempTagToken);
            this.skip(endTag + 1);
            this.skipSpace();

        }

    }

    //删除部分字符内容
    private skip(next: number) {
        // 换行数
        let lineNum = 0;
        // 新的行位置
        let newLinePos = -1;

        //检查是否有换行符
        for (let i = 0; i <= next; i++) {
            if (this.content.charCodeAt(i) === 10) {
                lineNum = lineNum + 1;
                newLinePos = i;
            }
        }

        this.offset = this.offset + next;
        this.row = this.row + lineNum;
        this.col = newLinePos === -1
            ? next
            : Math.max(1, next - newLinePos)

        this.content = this.content.slice(next);
    }


    private skipSpace() {
        let match = /^[\t\r\n\f ]+/.exec(this.content);
        if (match) {
            this.skip(match[0].length);
        }
    }

}

class TLParser {
    public file: string;
    public scan: TLScan;

    public nodeStackLevel: number;
    public nodeStack: TLNode[];
    public currentNode: TLNode;
    public topNode: TLNode;

    constructor(file: string) {
        this.setFile(file);
    }

    public setFile(file: string) {
        this.file = file;
        this.scan = new TLScan(file);
        this.nodeStackLevel = 0;
    }

    public startParse() {
        this.scan.startScan();
        l(this.scan);

        if (this.scan.tokens.length > 0) {
            this.topNode = new TLObjectNode(
                this.scan.tokens[0].name,
                []
            );
            this.currentNode = this.topNode;
            this.pushNode(this.currentNode);
            this.handleChildToken(1);
            l("123213",this.topNode);
        }

        l(this.topNode);
    }

    private handleChildToken(index: number) {
        let tokenLength = this.scan.tokens.length;
        if (index > tokenLength) {
            return;
        }

        // 第一个
        let i = index;
        let v = this.scan.tokens[i];

        let firstToken = this.scan.tokens[0];
        let nexToken: TLToken | null;


        //属性处理
        if (v.name != firstToken.name) {
            if (i < tokenLength - 1) {
                nexToken = this.scan.tokens[i + 1];
            } else {
                nexToken = null;
            }

            if (v.type == TLTokenKind.typeTag
                && nexToken.type == TLTokenKind.value) { /* 属性值 */

                let typeNode = new TLPropertyNode(
                    v.name,
                    []
                );
                typeNode.setParent(this.lastNode);
                this.lastNode.pushChild(typeNode);

            } else if (v.type == TLTokenKind.startTag) { /* 子属性 */
                this.currentNode = new TLObjectNode(
                    v.name,
                    []
                );
                this.currentNode.setParent(this.lastNode);
                this.lastNode.pushChild(this.currentNode);
                this.pushNode(this.currentNode);

                this.handleChildToken(i + 1);
            }
        }
    }
    private pushNode(node: TLNode) {
        this.nodeStack.push(node);
        this.nodeStackLevel = this.nodeStackLevel + 1;
    }
    private popNode(node: TLNode) {
        this.nodeStack.pop();
        this.nodeStackLevel = this.nodeStackLevel - 1;
    }

    get lastNode(): TLObjectNode {
        return this.nodeStack[this.nodeStack.length - 1] as TLObjectNode;
    }
}

// Token
class TLToken {
    public type: TLTokenKind;
    public name: string;

    public file: string;
    public start: number;
    public end: number;
    public raw: string;
}

// 标签Token
class TLTagToken extends TLToken {
    public initToken(
        type: TLTokenKind,
        name: string,

        file: string,
        start: number,
        end: number,
        raw: string,
    ) {
        this.type = type;
        this.name = name;

        this.file = file;
        this.start = start;
        this.end = end;
        this.raw = raw;

    }

}
// 值内容
class TLValueToken extends TLToken {
    public id: string;
    public value: string;

    public initToken(
        file: string,
        start: number,
        end: number,
        raw: string,

        id: string,
        value: string
    ) {
        this.type = TLTokenKind.value;
        this.name = "Value";

        this.file = file;
        this.start = start;
        this.end = end;
        this.raw = raw;

        this.id = id;
        this.value = value;
    }
}

// Node
class TLNode {
    public _name: string;
    public _parent: TLNode;
    public _child: TLNode[];

    constructor(
        name: string,
        child: TLNode[]
    ) {
        this._name = name;
        this._child = child;
    }


    public setParent(parent: TLNode) {
        this._parent = parent;
    }
}

class TLObjectNode extends TLNode {
    public pushChild(node: TLNode) {
        this._child.push(node);
    }
    public toString() {
        return JSON.stringify({
            "name": this._name,
            "parent": this._parent,
        });
    }

}

class TLPropertyNode extends TLObjectNode {

}

class TLValueNode extends TLNode {
    public _id: string;
    public _type: string;
    public _value: string;

    public initNode(
        parent: TLNode,
        id: string,
        type: string,
        value: string
    ) {
        this._parent = parent;
        this._id = id;
        this._type = type;
        this._value = value;
    }

    public toString() {
        return JSON.stringify({
            "name": this._name,
            "parent": this._parent,
            "id": this._id,
            "type": this._type,
            "value": this._value
        });
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