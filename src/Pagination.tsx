import React, {Reducer, useEffect, useReducer} from "react";

type Props<T> = {
    paginateObjects: ArrayLike<T>
    handlePageChange(page: T): void
    initialPosition?: number
}

export function Pagination<T>(props: Props<T>) {
    const {paginateObjects, handlePageChange} = props;
    const [pos, dispatchPosMessage] = useReducer<Reducer<number, { type: string }>>((state, action) => {
            switch (action.type) {
                case "next":
                    return paginateObjects[state + 1] !== undefined ? state + 1 : state;
                case "previous":
                    return paginateObjects[state - 1] !== undefined ? state - 1 : state;
                default:
                    throw new Error();
            }
        },
        props.initialPosition || 0);

    useEffect(() => {
        const newPage = paginateObjects[pos] !== undefined ? paginateObjects[pos] : paginateObjects[paginateObjects.length - 1];
        handlePageChange(newPage);
    }, [pos, paginateObjects, handlePageChange]);

    return (<nav>
        <button title={"Previous"} onClick={() => dispatchPosMessage({type: "previous"})}>{"<"}</button>
        <button title={"Next"} onClick={() => dispatchPosMessage({type: "next"})}>{">"}</button>
    </nav>)
}