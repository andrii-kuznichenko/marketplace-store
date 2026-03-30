'use client';

import { useReducer, useCallback } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { authReducer, initialState } from './authReducer';
import { useEmailStep } from './useEmailStep';
import { useCodeStep } from './useCodeStep';
import { useProfileStep } from './useProfileStep';
import { CodeValues, EmailValues, Navigate } from './types';

export const useAuthFlow = () => {
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const prefillEmail = useSearchParams().get('email') ?? '';

  const [state, dispatch] = useReducer(authReducer, initialState);

  const navigate = useCallback<Navigate>(
    ({ decorateUrl }) => {
      const url = decorateUrl('/');
      url.startsWith('http') ? (window.location.href = url) : router.push(url);
    },
    [router],
  );

  const emailStep = useEmailStep({ signIn, prefillEmail });
  const codeStep = useCodeStep({ signIn, signUp, navigate });
  const profileStep = useProfileStep({ signUp, navigate });

  const handleEmailSubmit = useCallback(
    async (values: EmailValues) => {
      const ok = await emailStep.onSubmit(values);
      if (ok) dispatch({ type: 'GO_TO_CODE', email: values.email });
    },
    [emailStep],
  );

  const handleCodeSubmit = useCallback(
    async (values: CodeValues) => {
      const result = await codeStep.onSubmit(values);
      if (result.outcome === 'needs_profile')
        dispatch({ type: 'GO_TO_PROFILE' });
    },
    [codeStep],
  );

  const reset = useCallback(() => {
    signIn.reset();
    emailStep.reset();
    codeStep.reset();
    profileStep.reset();
    dispatch({ type: 'RESET' });
  }, [signIn, emailStep, codeStep, profileStep]);

  return {
    state,
    isFetching: fetchStatus === 'fetching',
    clerkErrors,
    emailStep: { ...emailStep, onSubmit: handleEmailSubmit },
    codeStep: { ...codeStep, onSubmit: handleCodeSubmit },
    profileStep,
    reset,
  };
};
