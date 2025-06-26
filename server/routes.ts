import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { landRecordSearchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  // Get states by country ID
  app.get("/api/countries/:countryId/states", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      if (isNaN(countryId)) {
        return res.status(400).json({ error: "Invalid country ID" });
      }
      
      const states = await storage.getStatesByCountryId(countryId);
      res.json(states);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch states" });
    }
  });

  // Get all states
  app.get("/api/states", async (req, res) => {
    try {
      const states = await storage.getAllStates();
      res.json(states);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch states" });
    }
  });

  // Get districts by state ID
  app.get("/api/states/:stateId/districts", async (req, res) => {
    try {
      const stateId = parseInt(req.params.stateId);
      if (isNaN(stateId)) {
        return res.status(400).json({ error: "Invalid state ID" });
      }
      
      const districts = await storage.getDistrictsByStateId(stateId);
      res.json(districts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch districts" });
    }
  });

  // Get talukas by district ID
  app.get("/api/districts/:districtId/talukas", async (req, res) => {
    try {
      const districtId = parseInt(req.params.districtId);
      if (isNaN(districtId)) {
        return res.status(400).json({ error: "Invalid district ID" });
      }
      
      const talukas = await storage.getTalukasByDistrictId(districtId);
      res.json(talukas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch talukas" });
    }
  });

  // Get villages by taluka ID
  app.get("/api/talukas/:talukaId/villages", async (req, res) => {
    try {
      const talukaId = parseInt(req.params.talukaId);
      if (isNaN(talukaId)) {
        return res.status(400).json({ error: "Invalid taluka ID" });
      }
      
      const villages = await storage.getVillagesByTalukaId(talukaId);
      res.json(villages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch villages" });
    }
  });

  // Generate captcha
  app.get("/api/captcha", (req, res) => {
    const captcha = Math.random().toString(36).substring(2, 7).toUpperCase();
    // In a real implementation, you would store this in session or cache
    res.json({ captcha });
  });

  // Search land records
  app.post("/api/search-land-records", async (req, res) => {
    try {
      const validatedData = landRecordSearchSchema.parse(req.body);
      
      // Create search request
      const searchRequest = await storage.createSearchRequest({
        mobileNumber: validatedData.mobileNumber,
        stateId: validatedData.stateId,
        districtId: validatedData.districtId,
        talukaId: validatedData.talukaId,
        villageId: validatedData.villageId,
        surveyNumber: validatedData.surveyNumber,
        subdivisionNumber: validatedData.subdivisionNumber,
        ownerName: validatedData.ownerName,
        recordType: validatedData.recordType,
        propertyUid: validatedData.propertyUid,
        language: validatedData.language,
      });

      let landRecords: any[] = [];

      if (validatedData.searchMode === "uid" && validatedData.propertyUid) {
        // Search by Property UID
        const record = await storage.getLandRecordByPropertyUid(validatedData.propertyUid);
        if (record) {
          landRecords = [record];
        }
      } else if (validatedData.searchMode === "manual" && validatedData.villageId) {
        // Search by location and survey number
        if (validatedData.surveyNumber) {
          landRecords = await storage.getLandRecordsByVillageAndSurvey(
            validatedData.villageId,
            validatedData.surveyNumber,
            validatedData.subdivisionNumber
          );
        } else if (validatedData.ownerName) {
          landRecords = await storage.searchLandRecordsByOwner(
            validatedData.villageId,
            validatedData.ownerName
          );
        }
      }

      // Filter by record type
      const filteredRecords = landRecords.filter(record => 
        record.type === validatedData.recordType
      );

      res.json({
        searchRequestId: searchRequest.id,
        records: filteredRecords,
        total: filteredRecords.length
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: "Search failed" });
      }
    }
  });

  // Get land record by ID (for detailed view)
  app.get("/api/land-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }

      // This would need to be implemented in storage
      res.status(501).json({ error: "Not implemented" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch land record" });
    }
  });

  // Generate document (PDF)
  app.post("/api/generate-document/:recordId", async (req, res) => {
    try {
      const recordId = parseInt(req.params.recordId);
      const { language } = req.body;

      if (isNaN(recordId)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }

      // This would generate a PDF document
      // For now, return a mock response
      res.json({
        documentUrl: `/documents/${recordId}.pdf`,
        generatedAt: new Date().toISOString(),
        language
      });

    } catch (error) {
      res.status(500).json({ error: "Failed to generate document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
