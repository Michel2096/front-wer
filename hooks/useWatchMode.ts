import { useDeviceList } from "@/hooks/useDevice";
import { useMyDeviceId } from "@/hooks/useMyDeviceId";
import { useUiStore } from "@/store/uiStore";

// El "modo reloj" depende de CUÁL dispositivo es este aparato (dato local,
// ver useMyDeviceId), no de si la cuenta tiene algún reloj vinculado en
// general. Así, dos celulares con la misma sesión pueden mostrarse cada
// uno con su propia vista (reloj vs. teléfono) aunque compartan los mismos
// datos en tiempo real.
export function useWatchMode(): boolean {
  const { data } = useDeviceList();
  const { data: myDeviceId } = useMyDeviceId();
  const selectedDeviceType = useUiStore((s) => s.selectedDeviceType);

  const myDevice = data?.find((d) => d.id === myDeviceId);
  if (myDevice) return myDevice.type === "watch";

  // Mientras /device/list aún no refleja la conexión recién hecha (por
  // ejemplo, justo tras escanear el QR), se usa la selección de onboarding
  // como respaldo optimista.
  return selectedDeviceType === "smartwatch";
}
