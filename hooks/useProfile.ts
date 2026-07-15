import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";
import { User } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (payload: Partial<User>) => profileService.update(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["profile"], user);
    },
  });
}
