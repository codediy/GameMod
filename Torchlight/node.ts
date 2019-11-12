/* ***************Tag*************** */
/* 标签类型 */
export const enum TLTagType {
    start,
    end
}
/* 标签字符 */
export class TLTag {
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

/* ***************Token******************* */
export const enum TLTokenKind {
    startTag, /* 普通标签 */
    endTag,   /* 结束标签 */
    typeTag,  /* 类型标签 */
    value,    /* 值内容 */
}
class TLToken {
    public type: TLTokenKind;
    public name: string;

    public file: string;
    public start: number;
    public end: number;
    public raw: string;
}


// 标签Token
export  class TLTagToken extends TLToken {
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
export  class TLValueToken extends TLToken {
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

/* **************Node***************** */
interface TLTypeInterface {
    type: string,
    id: string,
    value: string,
}

interface TLObjectInterface {
    name: string,
    property: TLTypeInterface[],
    childs: TLObjectInterface[]
}


export  class TLType implements TLTypeInterface {
    type: string;
    id: string;
    value: string;


    constructor(
        type: string,
        id: string,
        value: string
    ) {
        this.type = type,
            this.id = id;
        this.value = value;
    }

    toJson(){
        return {
            "type":this.type,
            "id":this.id,
            "value":this.value
        }
    }

    toString(){
        return JSON.stringify(this.toJson());
    }
}

export  class TLObject implements TLObjectInterface {
    name: string;
    property: TLType[];
    childs: TLObject[];

    constructor(
        name: string
    ) {
        this.name = name
        this.property = [];
        this.childs = [];
    }

    addPro(pro: TLType) {
        this.property.push(pro);
    }

    addChild(child: TLObject) {
        this.childs.push(child);
    }

    toJson(){
        let child = [];
        let property = [];

        this.property.forEach((v,i,[]) => {
            property.push(v.toJson()); 
        });
        this.childs.forEach((v,i,[]) => {
            child.push(v.toJson());
        });

        return {
            "name":this.name,
            "property":property,
            "child":child,
        }
    }

    toString(){
        return JSON.stringify(this.toJson(),null,"\t");
    }
}
