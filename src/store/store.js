import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import modal from './modal.slice';
import meetup from './meetup.slice';

const reducers = combineReducers({
  modal: modal.reducer,
  meetup: meetup.reducer,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [],
  whitelist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  // devTools:
  middleware: [thunk],
});

export default store;
