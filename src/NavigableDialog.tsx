import React, {useState} from "react";


type Props = {
    contents: string[]
    pos: number
    updatePos(message: string, args: { pos: number }): void
}

export function NavigableDialog(props: Props) {
    const {contents, pos, updatePos} = props;
    const [collapse, setCollapse] = useState(true);

    return (<div className={"dialog"}>
        <button onClick={() => setCollapse(!collapse)}>{`Prev ${collapse ? "▲" : "▼"}`}</button>
        <p className={"previous-dialog"} title={"クリックで前へ"} hidden={collapse}
           onClick={(e) => {
               e.currentTarget.scrollTop = 0
               if (contents[pos - 1] !== undefined) updatePos(`ページ${pos - 1}`, {pos: pos - 1});
           }}>{contents[pos - 1] ?? "NA"}</p>
        <p className={"next-dialog"} title={"クリックで次へ"}
           onClick={(e) => {
               e.currentTarget.scrollTop = 0
               if (contents[pos + 1] !== undefined) updatePos(`ページ${pos + 1}`, {pos: pos + 1});
           }}>{contents[pos] ?? "NA"}</p>
    </div>)
}