import { type User, type InsertUser, type Provider, type InsertProvider, type Appointment, type InsertAppointment, type TimeSlot, type InsertTimeSlot } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Providers
  getAllProviders(): Promise<Provider[]>;
  getProvider(id: string): Promise<Provider | undefined>;
  searchProviders(query?: string, specialty?: string): Promise<Provider[]>;
  
  // Appointments
  getUserAppointments(userId: string): Promise<(Appointment & { provider: Provider })[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined>;
  cancelAppointment(id: string): Promise<boolean>;
  
  // Time slots
  getAvailableTimeSlots(providerId: string, date: string): Promise<TimeSlot[]>;
  bookTimeSlot(providerId: string, date: string, time: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private providers: Map<string, Provider> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private timeSlots: Map<string, TimeSlot> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample providers
    const provider1: Provider = {
      id: "provider1",
      firstName: "Emily",
      lastName: "Chen",
      specialty: "Cardiology",
      rating: "4.9",
      reviewCount: 127,
      location: "Medical Center East",
      room: "Room 205",
      bio: "Experienced cardiologist specializing in preventive care",
      isActive: true,
    };

    const provider2: Provider = {
      id: "provider2",
      firstName: "Michael",
      lastName: "Rodriguez",
      specialty: "General Practice",
      rating: "4.8",
      reviewCount: 203,
      location: "Medical Center East",
      room: "Room 103",
      bio: "Family medicine physician with focus on comprehensive care",
      isActive: true,
    };

    this.providers.set(provider1.id, provider1);
    this.providers.set(provider2.id, provider2);

    // Initialize time slots for the next 30 days
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const times = ["09:00", "10:30", "14:30", "16:00"];
      
      for (const providerId of ["provider1", "provider2"]) {
        for (const time of times) {
          const slot: TimeSlot = {
            id: randomUUID(),
            providerId,
            date: dateStr,
            time,
            isAvailable: true,
            duration: 30,
          };
          this.timeSlots.set(`${providerId}-${dateStr}-${time}`, slot);
        }
      }
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values()).filter(p => p.isActive);
  }

  async getProvider(id: string): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async searchProviders(query?: string, specialty?: string): Promise<Provider[]> {
    let providers = Array.from(this.providers.values()).filter(p => p.isActive);

    if (query) {
      const searchTerm = query.toLowerCase();
      providers = providers.filter(p => 
        p.firstName.toLowerCase().includes(searchTerm) ||
        p.lastName.toLowerCase().includes(searchTerm) ||
        p.specialty.toLowerCase().includes(searchTerm)
      );
    }

    if (specialty && specialty !== "All Specialties") {
      providers = providers.filter(p => p.specialty === specialty);
    }

    return providers;
  }

  async getUserAppointments(userId: string): Promise<(Appointment & { provider: Provider })[]> {
    const userAppointments = Array.from(this.appointments.values())
      .filter(apt => apt.userId === userId && apt.status !== "cancelled")
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

    const result = [];
    for (const appointment of userAppointments) {
      const provider = this.providers.get(appointment.providerId);
      if (provider) {
        result.push({ ...appointment, provider });
      }
    }

    return result;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: new Date(),
    };

    this.appointments.set(id, appointment);

    // Mark the time slot as unavailable
    const slotKey = `${insertAppointment.providerId}-${insertAppointment.date}-${insertAppointment.time}`;
    const slot = this.timeSlots.get(slotKey);
    if (slot) {
      slot.isAvailable = false;
      this.timeSlots.set(slotKey, slot);
    }

    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updated = { ...appointment, ...updates };
    this.appointments.set(id, updated);
    return updated;
  }

  async cancelAppointment(id: string): Promise<boolean> {
    const appointment = this.appointments.get(id);
    if (!appointment) return false;

    // Mark time slot as available again
    const slotKey = `${appointment.providerId}-${appointment.date}-${appointment.time}`;
    const slot = this.timeSlots.get(slotKey);
    if (slot) {
      slot.isAvailable = true;
      this.timeSlots.set(slotKey, slot);
    }

    appointment.status = "cancelled";
    this.appointments.set(id, appointment);
    return true;
  }

  async getAvailableTimeSlots(providerId: string, date: string): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values())
      .filter(slot => 
        slot.providerId === providerId && 
        slot.date === date && 
        slot.isAvailable
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  async bookTimeSlot(providerId: string, date: string, time: string): Promise<boolean> {
    const slotKey = `${providerId}-${date}-${time}`;
    const slot = this.timeSlots.get(slotKey);
    
    if (!slot || !slot.isAvailable) return false;
    
    slot.isAvailable = false;
    this.timeSlots.set(slotKey, slot);
    return true;
  }
}

export const storage = new MemStorage();
