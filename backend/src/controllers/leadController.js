import { ScraperService } from '../services/scraperService.js';
import { AIService } from '../services/aiService.js';
import { PDFService } from '../services/pdfService.js';
import { EmailService } from '../services/emailService.js';
import { SheetsService } from '../services/sheetsService.js';
import { DriveService } from '../services/driveService.js';
import path from 'path';

export class LeadController {
  static async createLead(req, res) {
    const { name, email, companyName, website, challenge } = req.body;

    // 1. Capture and Validate Inbound Form Information
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid work email' });
    }

    if (!website || !website.trim()) {
      return res.status(400).json({ error: 'Company website URL is required' });
    }

    try {
      console.log('--- STARTING WORKFLOW PIPELINE ---');
      console.log(`Lead Name: ${name}`);
      console.log(`Company URL: ${website}`);

      // STEP 1: Web Scraping & Metadata Mining
      console.log('Pipeline Step 1/5: Running Web Scraper...');
      const scrapedData = await ScraperService.scrape(website);
      
      // STEP 2: AI Diagnostic Analysis
      console.log('Pipeline Step 2/5: Synthesizing Insights via AI Service...');
      const aiData = await AIService.analyze(
        { name, email, companyName: companyName || scrapedData.domain, challenge },
        scrapedData
      );

      // STEP 3: Generate PDF Audit Document
      console.log('Pipeline Step 3/5: Compiling custom PDF audit...');
      const reportName = `report_${scrapedData.domain.replace(/\./g, '_')}_${Date.now()}.pdf`;
      const pdfPath = path.resolve(`storage/reports/${reportName}`);
      
      await PDFService.generateReport(
        { name, email, companyName: companyName || scrapedData.domain, challenge },
        scrapedData,
        aiData,
        pdfPath
      );

      // STEP 4: Google Drive Archiving (Fallback to static local URL)
      console.log('Pipeline Step 4/5: Archiving report to cloud container...');
      const pdfUrl = await DriveService.uploadPDF(pdfPath, companyName || scrapedData.domain);

      // STEP 5: Email Report PDF to Prospect
      console.log('Pipeline Step 5/5: Initiating email delivery...');
      let emailResult = { success: false, messageId: null, etherealUrl: null };
      try {
        emailResult = await EmailService.sendReport(
          { name, email, companyName: companyName || scrapedData.domain, challenge },
          pdfPath
        );
      } catch (emailError) {
        console.error('Workflow step (Email) failed, proceeding with pipeline:', emailError.message);
      }

      // STEP 6: Append lead details to Google Sheets/Local Storage
      console.log('Logging metrics to lead tracking databases...');
      const savedLead = await SheetsService.logLead(
        { name, email, companyName: companyName || scrapedData.domain, challenge },
        scrapedData,
        pdfUrl,
        emailResult.success ? 'Delivered' : 'Email Failed'
      );

      console.log('--- AUTOMATION WORKFLOW PIPELINE SUCCESSFUL ---');

      // Return a complete data payload representing E2E automation success
      return res.status(201).json({
        success: true,
        message: 'Lead workflow processed successfully',
        leadId: savedLead?.id || 'LID_UNKNOWN',
        pdfUrl,
        emailPreviewUrl: emailResult.etherealUrl,
        scraped: {
          domain: scrapedData.domain,
          title: scrapedData.title,
          description: scrapedData.description,
          scores: scrapedData.scores,
          metrics: scrapedData.metrics
        },
        analysis: {
          businessSummary: aiData.businessSummary,
          targetAudienceAnalysis: aiData.targetAudienceAnalysis,
          swot: aiData.swot,
          digitalAudits: aiData.digitalAudits,
          actionPlan: aiData.actionPlan,
          outreachEmail: aiData.outreachEmail
        }
      });

    } catch (err) {
      console.error('Workflow Pipeline crashed:', err);
      return res.status(500).json({
        error: 'An internal error occurred during the automation workflow. Please check details.',
        message: err.message
      });
    }
  }

  static async listLeads(req, res) {
    try {
      const leads = await SheetsService.getLeads();
      return res.status(200).json(leads);
    } catch (err) {
      console.error('Error listing leads:', err);
      return res.status(500).json({ error: 'Failed to retrieve lead dashboard database logs.' });
    }
  }
}
