import { useMutation } from "@tanstack/react-query";
import { signUp, signIn, SignUpData, SignInData } from "./api";

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignUpData) => signUp(data),
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: (data: SignInData) => signIn(data),
  });
}
