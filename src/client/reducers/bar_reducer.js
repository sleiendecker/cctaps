const initialState = window.__INITIAL__STATE__;

const bar = (state = initialState.currentBarId, action) => {
  switch (action.type) {
    case 'GOTO_BAR':
      return action.id;
    default:
      return state;
  }
};

export default bar;