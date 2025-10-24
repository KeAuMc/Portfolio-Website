import { create } from 'zustand';
import type { Provider } from '@shared/schema';

interface AppointmentState {
  selectedProvider: Provider | null;
  selectedDate: string | null;
  selectedTime: string | null;
  notes: string;
  reminderEmail: boolean;
  reminderSms: boolean;
  reminderPhone: boolean;
  
  setProvider: (provider: Provider) => void;
  setDateTime: (date: string, time: string) => void;
  setNotes: (notes: string) => void;
  setReminders: (email: boolean, sms: boolean, phone: boolean) => void;
  reset: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  selectedProvider: null,
  selectedDate: null,
  selectedTime: null,
  notes: '',
  reminderEmail: true,
  reminderSms: true,
  reminderPhone: false,
  
  setProvider: (provider) => set({ selectedProvider: provider }),
  setDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  setNotes: (notes) => set({ notes }),
  setReminders: (email, sms, phone) => set({ 
    reminderEmail: email, 
    reminderSms: sms, 
    reminderPhone: phone 
  }),
  reset: () => set({
    selectedProvider: null,
    selectedDate: null,
    selectedTime: null,
    notes: '',
    reminderEmail: true,
    reminderSms: true,
    reminderPhone: false,
  }),
}));
