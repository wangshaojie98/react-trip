const initState = {
  error: null
}

// actionTypes
export const types  = {
  CLEAR_ERROR: 'APP/CLEAR_ERROR'
}

// actionsCreator

export const actions = {
  clearError: () => ({
    type: types.CLEAR_ERROR
  })
}

// reducer

const reducer = (state = initState, action) => {
  return state;
}

export default reducer;
