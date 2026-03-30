import { AuthState, AuthAction } from './types';

export const initialState: AuthState = { step: 'email' };

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'GO_TO_CODE':
      return { step: 'code', email: action.email };
    case 'GO_TO_PROFILE':
      return { step: 'profile' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
