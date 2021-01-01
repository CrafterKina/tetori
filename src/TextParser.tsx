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
    if (content.length === 0) return [];
    const paragraphs = content.split("\n");
    return paragraphs.map(p => {
        return {
            dialog: p
        }
    });
}