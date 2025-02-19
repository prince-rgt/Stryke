import { create } from 'zustand';

interface UiState {
  triggerTradeOnboardingFlow: () => void;
  setTriggerTradeOnboardingFlow: (triggerTradeOnboardingFlow: () => void) => void;
}

export const useGlobalUiStore = create<UiState>((set) => ({
  triggerTradeOnboardingFlow: () => {},
  setTriggerTradeOnboardingFlow: (triggerTradeOnboardingFlow) => set({ triggerTradeOnboardingFlow }),
}));
