import React from 'react'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';

// Redirect's fuck up debugging authentication, use popup's for __DEV__
const useSignIn = () => __DEV__ ? signInWithPopup : signInWithRedirect;

export default useSignIn