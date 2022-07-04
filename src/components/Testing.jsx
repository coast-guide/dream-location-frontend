import { useReducer } from 'react';
import { useImmerReducer } from 'use-immer';

function Testing() {
  const initialState = {
    appleCount: 1,
    bananaCount: 10,
    message: 'hello',
    happy: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case 'addApple':
        draft.appleCount += 1;
        break;
      case 'changeEverything':
        draft.appleCount = draft.appleCount + 10;
        draft.bananaCount = draft.bananaCount - 1;
        draft.message = action.customMessage;
        draft.happy = !draft.happy;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  return (
    <>
      <div>Right now count of the apple is {state.appleCount}</div>
      <div>Right now count of banans is {state.bananaCount}</div>
      <div>Right now the message is {state.message}</div>
      {state.happy ? <h1>I am happy</h1> : <h1>I am not happy</h1>}
      <br />
      <button onClick={() => dispatch({ type: 'addApple' })}>Add apple</button>
      <br />
      <button
        onClick={() =>
          dispatch({
            type: 'changeEverything',
            customMessage: 'the message is now coming from dispatch',
          })
        }
      >
        CHANGE EVERYTHING
      </button>
    </>
  );
}

export default Testing;
