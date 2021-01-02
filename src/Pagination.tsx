import React from "react";

type Props<T> = {
    paginateObjects: ArrayLike<T>
    handlePageChange: (page: T) => void
    initialPosition?: number
}

export function Pagination<T>(props: Props<T>) {
    return (<></>)
}