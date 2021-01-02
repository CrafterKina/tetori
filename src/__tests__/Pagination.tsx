import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {Pagination} from "../Pagination";

describe("Pagination機能はArray要素を移動する機能を持つ", () => {
    test("前へ/次へボタン", () => {
        const array = [0, 1, 2]
        const handlePageChange = jest.fn()

        render(<Pagination paginateObjects={array} initialPosition={0} handlePageChange={handlePageChange}/>);

        const prev = screen.getByTitle(/Previous/i);
        const next = screen.getByTitle(/Next/i);

        expect(prev).toBeInTheDocument();
        expect(next).toBeInTheDocument();

        fireEvent.click(next);
        expect(handlePageChange).toHaveBeenCalledTimes(1);
        expect(handlePageChange).toHaveBeenLastCalledWith(1);

        fireEvent.click(next);
        expect(handlePageChange).toHaveBeenCalledTimes(2);
        expect(handlePageChange).toHaveBeenLastCalledWith(2);

        // 終端に到達している
        fireEvent.click(next);
        expect(handlePageChange).toHaveBeenCalledTimes(2); // 呼ばれていない
        expect(handlePageChange).toHaveBeenLastCalledWith(2);

        fireEvent.click(prev);
        expect(handlePageChange).toHaveBeenCalledTimes(3);
        expect(handlePageChange).toHaveBeenLastCalledWith(1);

        fireEvent.click(prev);
        expect(handlePageChange).toHaveBeenCalledTimes(4);
        expect(handlePageChange).toHaveBeenLastCalledWith(0);

        // 0に到達している
        fireEvent.click(prev);
        expect(handlePageChange).toHaveBeenCalledTimes(4); // 呼ばれていない
        expect(handlePageChange).toHaveBeenLastCalledWith(0);
    })
})