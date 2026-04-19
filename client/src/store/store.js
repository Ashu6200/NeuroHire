import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { neuroHireApi } from './apiService';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userReducer } from './userFeature/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userStore'],
};
const rootReducer = combineReducers({
  userStore: userReducer,
  [neuroHireApi.reducerPath]: neuroHireApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }).concat(neuroHireApi.middleware),
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);
