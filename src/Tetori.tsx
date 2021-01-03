import React, {useState} from "react";
import {Pagination} from "./Pagination";

export interface TetoriPage {
    dialog: string
}

export type TetoriContent = Array<TetoriPage>

type Props = {
    contents: TetoriContent
}

export function Tetori(props: Props) {
    const [currentPage, setPage] = useState(props.contents[0]);

    return (<div>
        {currentPage ? <p>{currentPage.dialog}</p> : ""}
        <Pagination paginateObjects={props.contents} handlePageChange={setPage}/>
    </div>)
}