import rootReducer from './modules';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

let store;

if (process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__) {
	let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
} else {
	store = createStore(rootReducer, applyMiddleware(thunk))
}

export default store;