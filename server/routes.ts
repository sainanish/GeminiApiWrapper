import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { credentialingRequestSchema } from "@shared/schema";
import { callGeminiAPI, combineDocuments } from "./credentialing";

export async function registerRoutes(app: Express): Promise<Server> {
  // Credentialing evaluation endpoint
  app.post("/api/evaluate", async (req, res) => {
    try {
      // Validate request body
      const validatedData = credentialingRequestSchema.parse(req.body);
      
      // Combine documents for AI evaluation
      const combinedDocuments = combineDocuments(validatedData);
      
      // Call Gemini AI API
      const evaluationResult = await callGeminiAPI(combinedDocuments);
      
      res.json(evaluationResult);
    } catch (error) {
      console.error("Evaluation error:", error);
      
      if (error instanceof Error) {
        res.status(400).json({
          error: "Evaluation failed",
          message: error.message
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
          message: "An unexpected error occurred"
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
