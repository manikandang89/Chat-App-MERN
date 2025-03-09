import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.tsx';
import themeSlice from './useThemeSlice.tsx';


export const store = configureStore({
  reducer: {
        user : userReducer,
        theme : themeSlice
        
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch