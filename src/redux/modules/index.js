import { combineReducers } from 'redux';
import app from './app';
import trip from './trip';
export default combineReducers({
  app,
  trip
}) 