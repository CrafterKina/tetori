import React, {ChangeEventHandler} from "react";
import {TetoriContent} from "./App";

type Props = {
    setTetoriContent(tetoriContent: TetoriContent): void;
}

export function TextParser(props: Props) {
    const handleChange: ChangeEventHandler = (event) => {
        const content = event.target.textContent || "";
        props.setTetoriContent(parse(content));
    };

    return (
        <textarea onChange={handleChange}/>
    )
}

export function parse(content: string): TetoriContent {
    const paragraphs = content.split("\n");
    return paragraphs.filter(p => p.length !== 0).map(p => {
        return {
            dialog: p
        }
    });
}