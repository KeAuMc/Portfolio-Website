import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = loginSchema.parse(req.body);
      
      // For demo purposes, create a user if they don't exist
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({
          email,
          password, // In production, hash this!
          role,
          username: email.split('@')[0],
          firstName: "Sarah",
          lastName: "Johnson",
          phone: "+1-555-0123",
        });
      }

      // Simple auth check - in production use proper password hashing
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Provider routes
  app.get("/api/providers", async (req, res) => {
    try {
      const { query, specialty } = req.query as { query?: string; specialty?: string };
      const providers = await storage.searchProviders(query, specialty);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch providers" });
    }
  });

  app.get("/api/providers/:id", async (req, res) => {
    try {
      const provider = await storage.getProvider(req.params.id);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider" });
    }
  });

  // Time slot routes
  app.get("/api/providers/:providerId/slots/:date", async (req, res) => {
    try {
      const { providerId, date } = req.params;
      const slots = await storage.getAvailableTimeSlots(providerId, date);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time slots" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      // Check if time slot is still available
      const slots = await storage.getAvailableTimeSlots(appointmentData.providerId, appointmentData.date);
      const isSlotAvailable = slots.some(slot => slot.time === appointmentData.time);
      
      if (!isSlotAvailable) {
        return res.status(409).json({ error: "This time slot is no longer available" });
      }

      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const appointment = await storage.updateAppointment(id, updates);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.cancelAppointment(id);
      
      if (!success) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
