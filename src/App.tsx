import React, {Reducer, useReducer} from 'react';
import {Tetori, TetoriContents} from "./Tetori";
import {SourceSwitcher} from "./SourceSwitcher";
import {ChangeLog} from "./ChangeLog";

type Step = { message: string, snapshot: TetoriContents };
type History = { stepNumber: number, history: Array<Step> }

export type EditMessage = { type: "edit", snapshot: TetoriContents, message: string };
export type JumpMessage = { type: "jump", to: number }

function App() {
    const [state, dispatchMessage] = useReducer<Reducer<History, EditMessage | JumpMessage>>((state, action) => {
        switch (action.type) {
            case "edit": {
                const {message, snapshot} = action;
                return {stepNumber: state.history.length, history: state.history.concat({message, snapshot})};
            }
            case "jump": {
                return Object.assign({}, state, {stepNumber: action.to});
            }
        }
    }, {stepNumber: 0, history: [{message: "新規", snapshot: []}]});

    return (
        <div className="App">
            <SourceSwitcher dispatchEditMessage={dispatchMessage}/>
            <Tetori contents={state.history[state.stepNumber].snapshot} dispatchEditMessage={dispatchMessage}/>
            <ChangeLog dispatchJumpMessage={dispatchMessage} log={state.history.map(e => e.message)}/>
        </div>
    );
}

export default App;
