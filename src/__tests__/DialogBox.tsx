import React from "react";
import {render, screen} from "@testing-library/react";

import {DialogBox} from "../DialogBox";

test("指定した内容を描画する", () => {
    render(<DialogBox content={"foobarbaz"}/>);

    expect(screen.getByText("foobarbaz")).toBeInTheDocument();
});