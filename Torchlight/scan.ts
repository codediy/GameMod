import * as fs from "fs";
import {
    TLTagType,
    TLTag,

    TLTokenKind,
    TLTagToken,
    TLValueToken
} from "./node";

/* 解析器 */
export class TLScan {
    public file: string;
    public row: number;

    public col: number;
    public offset: number;

    public content: string;

    public _tokens: (TLTagToken | TLValueToken)[];
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
        let c = fs.readFileSync(this.file, this.encode);
        if(c){
            this.content = c.trim();
            this.handleContent();
        }
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
                TLTokenKind.typeTag,
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