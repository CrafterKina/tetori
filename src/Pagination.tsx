import React, {useEffect, useState} from "react";

type Props<T> = {
    paginateObjects: ArrayLike<T>
    handlePageChange(page: T): void
    initialPosition?: number
}

export function Pagination<T>(props: Props<T>) {
    const [pos, updatePos] = useState(props.initialPosition || 0);
    const {paginateObjects, handlePageChange} = props;
    useEffect(() => {
        handlePageChange(paginateObjects[pos]);
    }, [pos, paginateObjects, handlePageChange]);

    return (<nav>
        <button title={"Previous"} onClick={() => movePos(pos - 1)}>{"<"}</button>
        <button title={"Next"} onClick={() => movePos(pos + 1)}>{">"}</button>
    </nav>)

    function movePos(pos: number) {
        const p = props.paginateObjects[pos];
        if (p !== undefined) { // element can be falsy
            updatePos(pos);
        }
    }
}