'use client';

import { createContext, useContext, useReducer } from 'react';

const LoginContext = createContext(null);
const initialState = { status: 'idle', message: '' };

export function loginReducer(state, action) {
  switch (action.type) {
    case 'submit':
      return { status: 'submitting', message: '' };
    case 'failure':
      return { status: 'error', message: action.message };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

export function LoginProvider({ children }) {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  return <LoginContext.Provider value={{ state, dispatch }}>{children}</LoginContext.Provider>;
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) throw new Error('useLogin must be used within LoginProvider');
  return context;
}