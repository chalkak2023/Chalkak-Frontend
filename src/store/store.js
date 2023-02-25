import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import modal from './modal.slice';

const reducers = combineReducers({
  modal: modal.reducer,
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
