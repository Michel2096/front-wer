import { create } from "zustand";
import { DeviceConnectionState, DeviceType } from "@/types/device";
import { HistoryRange } from "@/types/health";

interface UiState {
  selectedDeviceType: DeviceType | null;
  watchConnectionState: DeviceConnectionState;
  historyRange: HistoryRange;
  setSelectedDeviceType: (type: DeviceType | null) => void;
  setWatchConnectionState: (state: DeviceConnectionState) => void;
  setHistoryRange: (range: HistoryRange) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedDeviceType: null,
  watchConnectionState: "esperando",
  historyRange: "daily",
  setSelectedDeviceType: (selectedDeviceType) => set({ selectedDeviceType }),
  setWatchConnectionState: (watchConnectionState) => set({ watchConnectionState }),
  setHistoryRange: (historyRange) => set({ historyRange }),
}));
