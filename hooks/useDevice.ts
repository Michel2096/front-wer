import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deviceService } from "@/services/deviceService";
import { connectSocket } from "@/services/socket";
import { SOCKET_EVENTS } from "@/constants/config";
import { useUiStore } from "@/store/uiStore";
import { rememberMyDeviceId } from "@/hooks/useMyDeviceId";

export function useDeviceQr() {
  const setWatchConnectionState = useUiStore((s) => s.setWatchConnectionState);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["device-qr"],
    queryFn: () => deviceService.qr(),
  });

  useEffect(() => {
    setWatchConnectionState("esperando");
    let active = true;

    connectSocket().then((socket) => {
      if (!active) return;

      const onConnected = () => {
        setWatchConnectionState("conectado");
        queryClient.invalidateQueries({ queryKey: ["device-list"] });
      };

      socket.on(SOCKET_EVENTS.deviceConnected, onConnected);

      return () => {
        socket.off(SOCKET_EVENTS.deviceConnected, onConnected);
      };
    });

    return () => {
      active = false;
    };
  }, [queryClient, setWatchConnectionState]);

  return query;
}

export function useConnectPhone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deviceService.connectPhone(),
    onSuccess: (device) => {
      queryClient.invalidateQueries({ queryKey: ["device-list"] });
      rememberMyDeviceId(queryClient, device.id);
    },
  });
}

export function useDeviceList() {
  return useQuery({
    queryKey: ["device-list"],
    queryFn: () => deviceService.list(),
  });
}

export function useDisconnectDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => deviceService.disconnect(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-list"] });
    },
  });
}
