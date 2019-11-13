import { TLObject, TLType } from "../node";
import { TLGen } from "../gen";
import { l } from "../util";

// Test
let o = new TLObject("Layout");
let g = new TLGen("./gen/test.LAYOUT");

o.addPro(
    new TLType(
        "INTEGER",
        "VERSION",
        "4"
    )
);
o.addPro(
    new TLType(
        "UNSIGNED INT",
        "COUNT",
        "2"
    )
);
o.addChild(
    new TLObject(
        "OBJECTS",
        [
            new TLObject(
                "BASEOBJECT",
                [
                    new TLObject(
                        "PROPERTIES",
                        [],
                        [
                            new TLType(
                                "STRING",
                                "DESCRIPTOR",
                                "Group"
                            ),
                            new TLType(
                                "STRING",
                                "NAME",
                                "UIForBoss"
                            ),
                            new TLType(
                                "INTEGER64",
                                "PARENTID",
                                "-1"
                            ),
                            new TLType(
                                "INTEGER64",
                                "ID",
                                "-9081988296190006617"
                            )
                        ]
                    ),
                    new TLObject(
                        "CHILDREN",
                        [
                            new TLObject(
                                "BASEOBJECT",
                                [
                                    new TLObject(
                                        "PROPERTIES",
                                        [],
                                        [
                                            new TLType(
                                                "STRING",
                                                "DESCRIPTOR",
                                                "Menu Controller"
                                            ),
                                            new TLType(
                                                "STRING",
                                                "NAME",
                                                "Menu Controller"
                                            ),
                                            new TLType(
                                                "INTEGER64",
                                                "PARENTID",
                                                "-9081988296190006617"
                                            ),
                                            new TLType(
                                                "INTEGER64",
                                                "ID",
                                                "459527854028091006"
                                            ),
                                            new TLType(
                                                "STRING",
                                                "MENU NAME",
                                                "BOSSMEET"
                                            ),
                                            new TLType(
                                                "STRING",
                                                "WIDGET 0",
                                                "BOSSNAME"
                                            ),
                                            new TLType(
                                                "STRING",
                                                "TEXT 0",
                                                "General Grell"
                                            )
                                        ]
                                    )
                                ]
                            )
                        ]
                    )
                ]
            )
        ],
        [],
    )
)



l(o);
g.toString(o);
g.writeToFile();
l(g.result);
