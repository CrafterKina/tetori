import "./app.css"

import React, {Reducer, useReducer} from 'react';
import {EmptySnapshot, Snapshot, Tetori} from "./Tetori";
import {SourceSwitcher} from "./SourceSwitcher";
import {ChangeLog} from "./ChangeLog";

type Step = { message: string, snapshot: Snapshot };
type History = { stepNumber: number, history: Array<Step> }

export type EditMessage = { type: "edit", snapshot: Snapshot, message: string };
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
    }, {stepNumber: 0, history: [{message: "新規", snapshot: EmptySnapshot()}]});

    return (
        <div className="App">
            <SourceSwitcher dispatchEditMessage={dispatchMessage}/>
            <Tetori dispatchEditMessage={dispatchMessage}  {...state.history[state.stepNumber].snapshot} />
            <ChangeLog dispatchJumpMessage={dispatchMessage} log={state.history.map(e => e.message)}/>
        </div>
    );
}

export default App;
