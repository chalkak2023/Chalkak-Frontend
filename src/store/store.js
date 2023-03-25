import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import photospot from './photospot.slice';
import modal from './modal.slice';
import meetup from './meetup.slice';
import user from './user.slice';
import admin from './admin.slice';
import nav from './nav.slice';
import collection from "./collection.slice";
import footer from "./footer.slice";
import photo from './photo.slice';
import  { createStateSyncMiddleware , initStateWithPrevTab } from "redux-state-sync" ;

const reduxStateSyncConfig = {
  predicate: action => action.type.startsWith('user/') || action.type.startsWith('admin/'),
} ;

const reducers = combineReducers({
  modal: modal.reducer,
  meetup: meetup.reducer,
  user: user.reducer,
  admin: admin.reducer,
  nav: nav.reducer,
  photospot: photospot.reducer,
  collection: collection.reducer,
  footer: footer.reducer,
  photo: photo.reducer,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  // blacklist: [],
  // whitelist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  // devTools:
  middleware: [thunk, createStateSyncMiddleware (reduxStateSyncConfig)],
});

initStateWithPrevTab(store); 

export default store;
