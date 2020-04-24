const initState = {
	user: null,
	userDistance: null
};

// actionTypes
export const types = {
	SET_USER: 'TRIP/SET_USER',
	SET_USER_DISTANCE: 'TRIP/SET_USER_DISTANCE'
};

// actionsCreator

export const actions = {
	setUser: (user) => ({
		type: types.SET_USER,
		user
	}),
	setDistance: (userDistance) => ({
		type: types.SET_USER_DISTANCE,
		userDistance
	})
};

// reducer

const reducer = (state = initState, action) => {
	console.log(action);
	switch (action.type) {
		case types.SET_USER:
			return Object.assign({}, state, {
				user: action.user
			});
		case types.SET_USER_DISTANCE:
			return Object.assign({}, state, {
				userDistance: action.userDistance
			});
		default:
			return state;
	}
};

export default reducer;

export const getUser = (state) => {
	return state.trip.user
}

export const getUserDistance = (state) => {
	console.log(state.trip.userDistance);
	return state.trip.userDistance
}