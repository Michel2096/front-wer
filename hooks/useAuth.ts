import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { LoginPayload, RegisterPayload } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";
import { forgetMyDeviceId } from "@/hooks/useMyDeviceId";

export function useSession() {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await authService.session();
      setUser(result.authenticated ? result.user ?? null : null);
      return result;
    },
    retry: false,
  });
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clear();
      queryClient.clear();
      forgetMyDeviceId(queryClient);
    },
  });
}
