import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import photospotModal from './photospot.slice';
import modal from './modal.slice';
import meetup from './meetup.slice';
import user from './user.slice';
import nav from './nav.slice';

const reducers = combineReducers({
  modal: modal.reducer,
  meetup: meetup.reducer,
  user: user.reducer,
  nav: nav.reducer,
  photospotModal: photospotModal.reducer,
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
