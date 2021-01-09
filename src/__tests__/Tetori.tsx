import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Tetori} from '../Tetori';

describe("NavigableDialog関連", () => {
    const contents = [
        {
            pane: {},
            dialog: "foo",
        },
        {
            pane: {},
            dialog: "bar",
        },
        {
            pane: {},
            dialog: "baz",
        },
    ];

    test("前へ/次へボタン", () => {
        const mock = jest.fn();
        render(<Tetori contents={contents} dispatchEditMessage={mock}/>)

        const prev = screen.getByTitle(/Previous/i);
        const next = screen.getByTitle(/Next/i);

        expect(prev).toBeVisible();
        expect(next).toBeVisible();

        expect(screen.getByText("foo")).toBeVisible();

        fireEvent.click(next)
        expect(screen.getByText("bar")).toBeVisible();
        expect(prev).toHaveTextContent("foo");

        fireEvent.click(next)
        expect(screen.getByText("baz")).toBeVisible();
        expect(prev).toHaveTextContent("bar");

        fireEvent.click(next)
        expect(screen.getByText("baz")).toBeVisible();
        expect(prev).toHaveTextContent("bar");

        fireEvent.click(prev)
        expect(screen.getByText("bar")).toBeVisible();
        expect(prev).toHaveTextContent("foo");

        fireEvent.click(prev)
        expect(screen.getByText("foo")).toBeVisible();

        fireEvent.click(prev)
        expect(screen.getByText("foo")).toBeVisible();
    })

    test("要素数が現地点より小さい場合にページを終端に合わせる", () => {
        const mock = jest.fn();
        const {rerender} = render(<Tetori contents={contents.slice(0, 3)} dispatchEditMessage={mock}/>)
        const next = screen.getByTitle(/Next/i);

        fireEvent.click(next);
        fireEvent.click(next);
        expect(screen.getByText("baz")).toBeVisible();

        rerender(<Tetori contents={contents.slice(0, 2)} dispatchEditMessage={mock}/>)
        expect(screen.getByText("bar")).toBeVisible();
    })

    test("空配列から要素が追加された場合最初の要素に移動する", () => {
        const mock = jest.fn();
        const {rerender} = render(<Tetori contents={[]} dispatchEditMessage={mock}/>)
        expect(screen.queryByText("foo")).toBeNull();
        expect(screen.queryByText("bar")).toBeNull();
        expect(screen.queryByText("baz")).toBeNull();

        rerender(<Tetori contents={contents} dispatchEditMessage={mock}/>)
        expect(screen.getByText("foo")).toBeVisible();
    })
})