import React from "react";

export type Props = {
    content: string
}

export function DialogBox(props: Props) {
    return (<p>{props.content}</p>)
}