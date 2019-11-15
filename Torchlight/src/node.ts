/* ***************Tag*************** */
/* 标签类型 */
export const enum TLTagType {
    start,
    end,
    type,
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
export class TLTagToken extends TLToken {
    public initToken(
        type: TLTokenKind,
        name: string,

        start: number,
        end: number,
        raw: string,
        
        file?: string,
    ) {
        this.type = type;
        this.name = name;

        this.start = start;
        this.end = end;
        this.raw = raw;

        this.file = file || "";
    }

}
// 值内容
export class TLValueToken extends TLToken {
    public id: string;
    public value: string;

    public initToken(
        id: string,
        value: string,

        start: number,
        end: number,
        raw: string,
        
        file?: string,
    ) {
        this.type = TLTokenKind.value;
        this.name = "Value";

        this.start = start;
        this.end = end;
        this.raw = raw;

        this.id = id;
        this.value = value;

        this.file = file || "";
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


export class TLType implements TLTypeInterface {
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

    toJson() {
        return {
            "type": this.type,
            "id": this.id,
            "value": this.value
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

export class TLObject implements TLObjectInterface {
    name: string;
    property: TLType[];
    childs: TLObject[];

    constructor(
        name: string,
        childs?: TLObject[],
        property?: TLType[],
    ) {
        this.name = name
        this.property = property || [];
        this.childs = childs || [];
    }



    addPro(pro: TLType) {
        this.property.push(pro);
    }

    addChild(child: TLObject) {
        this.childs.push(child);
    }

    toJson() {
        let property = [];
        let child = [];

        this.property.forEach((v, i, []) => {
            property.push({
                [v.id.toLowerCase()]:v.value+" : "+v.type.toLowerCase()
            })
        });
        
        this.childs.forEach((v, i, []) => {
            child.push({
                [v.name.toLowerCase()]:v.toJson()
            })
        });

        return {
            "property": property,
            "child": child,
        }
    }

    toString() {
        return JSON.stringify(this.toJson(), null, "\t");
    }
}
