import React, {Reducer, useReducer} from 'react';
import {Tetori, TetoriContents} from "./Tetori";
import {SourceSwitcher} from "./SourceSwitcher";

type Step = { message: string, snapshot: TetoriContents };
type History = { stepNumber: number, history: Array<Step> }

export type EditMessage = { type: "edit", snapshot: TetoriContents, message: string };

function App() {
    const [state, dispatchMessage] = useReducer<Reducer<History, EditMessage>>((state, action) => {
        switch (action.type) {
            case "edit": {
                const {message, snapshot} = action;
                return {stepNumber: state.history.length, history: state.history.concat({message, snapshot})};
            }
        }
    }, {stepNumber: 0, history: [{message: "新規", snapshot: []}]});

    return (
        <div className="App">
            <SourceSwitcher dispatchEditMessage={dispatchMessage}/>
            <Tetori contents={state.history[state.stepNumber].snapshot}/>
        </div>
    );
}

export default App;
