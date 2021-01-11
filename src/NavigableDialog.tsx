import React from "react";


type Props = {
    contents: string[]
    pos: number
    updatePos(message: string, args: { pos: number }): void
}

export function NavigableDialog(props: Props) {
    const {contents, pos, updatePos} = props;

    return (<div className={"dialog"}>
        <p className={"previous-dialog"} title={"Previous"}
           onClick={() => {
               if (contents[pos - 1] !== undefined) updatePos(`ページ${pos - 1}`, {pos: pos - 1});
           }}>{contents[pos - 1] ?? "NA"}</p>
        <p className={"next-dialog"} title={"Next"}
           onClick={() => {
               if (contents[pos + 1] !== undefined) updatePos(`ページ${pos + 1}`, {pos: pos + 1});
           }}>{contents[pos] ?? "NA"}</p>
    </div>)
}