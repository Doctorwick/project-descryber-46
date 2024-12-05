import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/message';

interface SimulationState {
  isActive: boolean;
  isPaused: boolean;
  messages: Message[];
  setIsActive: (isActive: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setMessages: (messages: Message[]) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      isActive: false,
      isPaused: false,
      messages: [{
        id: 1,
        text: "Hi! I'm here to help you test Descryber's filtering system. Try sending some messages!",
        sender: "bot",
        timestamp: new Date().toISOString()
      }],
      setIsActive: (isActive) => set({ isActive }),
      setIsPaused: (isPaused) => set({ isPaused }),
      setMessages: (messages) => set({ messages }),
      reset: () => set({
        isActive: false,
        isPaused: false,
        messages: [{
          id: 1,
          text: "Simulation ended. Click Start to begin a new session!",
          sender: "bot",
          timestamp: new Date().toISOString()
        }]
      })
    }),
    {
      name: 'simulation-storage'
    }
  )
);