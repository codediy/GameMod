import { TLObject, TLTag, TLTagType, TLType } from "./node";
import * as fs from "fs";
import { l } from "./util";

export class TLGen {
    public _tag: TLTag;
    public _file: string;
    public _indent: number;
    public _indentChar: string;
    public _newLineChar: string;
    public _result: string;

    constructor(
        file: string,
    ) {
        this.setFile(file);
    }

    public setFile(file: string) {
        this._file = file;
        this._indent = 0;
        this._indentChar = "\t";
        this._newLineChar = "\n";
        this._tag = new TLTag();

        this._result = "";
    }

    public setIndentChar(char: string) {
        this._indentChar = char;
    }


    public toString(object: TLObject) {
        this._result += this.tagString(object.name);
        this._indent = this._indent + 1;

        if (object.property.length > 0) {
            object.property.forEach((v, i, []) => {
                this._result += this._newLineChar;
                this._result += this.tagString(v.type);
                this._result += v.id + this._tag.valueSplit + v.value;
            });
        }

        if (object.childs.length > 0) {
            object.childs.forEach((v, i, []) => {
                this._result += this._newLineChar;
                this.toString(v);
            })
        }

        this._result += this._newLineChar;
        this._indent = this._indent - 1;
        this._result += this.tagString(object.name, TLTagType.end);
    }

    private tagString(name: string, type: TLTagType = TLTagType.start) {
        let result: string;
        if (type === TLTagType.start) {
            result = this._tag.startTagLeft + name + this._tag.tagRight;
        }
        if (type === TLTagType.end) {
            result = this._tag.startTagLeft + this._tag.endTagLeft + name + this._tag.tagRight;
        }
        if (type === TLTagType.type) {
            result = this._tag.typeTagLeft + name + this._tag.typeTagRight;
        }

        let indent = "";
        if(this._indent > 0){
            for (let index = 1; index <= this._indent; index++) {
                indent += this._indentChar;
            }
            result = indent + result
        }
        
        return result;
    }

    public writeToFile() {
        if (this._result && this._file) {
            fs.writeFile(this._file,this._result,(err)=>{
                l(this._file,"生成成功...");
            });
        }
    }

    get result() {
        return this._result;
    }
}

