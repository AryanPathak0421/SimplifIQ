import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const localLeadsPath = path.resolve('storage/leads.json');

export class SheetsService {
  static ensureLocalStorage() {
    const dir = path.dirname(localLeadsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(localLeadsPath)) {
      fs.writeFileSync(localLeadsPath, JSON.stringify([], null, 2));
    }
  }

  static async logLead(leadData, scrapedData, pdfUrl, status = 'Success') {
    // 1. Save to local storage first (ensures we always have local DB for admin dashboard)
    this.ensureLocalStorage();
    try {
      const data = fs.readFileSync(localLeadsPath, 'utf8');
      const leads = JSON.parse(data);
      
      const newLead = {
        id: 'LID_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: leadData.name,
        email: leadData.email,
        companyName: leadData.companyName || scrapedData.domain,
        website: scrapedData.url,
        challenge: leadData.challenge || 'Digital Strategy',
        scores: scrapedData.scores,
        pdfUrl,
        status,
        timestamp: new Date().toISOString()
      };

      leads.unshift(newLead); // Add to beginning
      fs.writeFileSync(localLeadsPath, JSON.stringify(leads, null, 2));
      console.log(`Lead logged locally in storage/leads.json. Total leads: ${leads.length}`);

      // 2. Try to sync with Google Sheets if credentials are provided
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (spreadsheetId && credentialsPath && fs.existsSync(credentialsPath)) {
        console.log('Syncing lead with Google Sheets API...');
        const auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const values = [
          [
            newLead.id,
            newLead.name,
            newLead.email,
            newLead.companyName,
            newLead.website,
            newLead.challenge,
            newLead.scores.seo,
            newLead.scores.performance,
            newLead.scores.leadGen,
            newLead.scores.overall,
            newLead.pdfUrl,
            newLead.status,
            newLead.timestamp
          ]
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Sheet1!A:M',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values },
        });
        console.log('Lead successfully written to Google Sheets!');
      } else {
        console.log('Google Sheets API is unconfigured. Lead saved locally only.');
      }

      return newLead;
    } catch (err) {
      console.error('Error logging lead:', err);
      // Don't crash the workflow if logging fails
    }
  }

  static async getLeads() {
    this.ensureLocalStorage();
    try {
      const data = fs.readFileSync(localLeadsPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading local leads:', err);
      return [];
    }
  }
}
