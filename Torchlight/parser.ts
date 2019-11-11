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

    get tokens()
    {
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
        while(this.content.length > 0){
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
        l(this.tokens);
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
    constructor(
        name: string,
        child: Node[]
    ) { }
}

class TLNodeToken extends TLTagToken {
    public child: TLToken[];

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

    public childPush(token: TLToken) {
        this.child.push(token);
    }

}


// Test
// let file = "./media/BOSS_RESISTS.DAT";
// let parser: TLScan = new TLScan(file);
// parser.startScan();

function l(...e) {
    console.log(e);
}