import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export class DriveService {
  static async uploadPDF(filePath, companyName) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const fileName = path.basename(filePath);
    
    // Default local fallback URL
    const localUrl = `/reports/${fileName}`;

    if (credentialsPath && folderId && fs.existsSync(credentialsPath)) {
      try {
        console.log('Uploading PDF to Google Drive...');
        const auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        const fileMetadata = {
          name: `SimplifIQ_Audit_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
          parents: [folderId],
        };

        const media = {
          mimeType: 'application/pdf',
          body: fs.createReadStream(filePath),
        };

        const file = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id, webViewLink, webContentLink',
        });

        console.log(`PDF successfully uploaded to Google Drive! File ID: ${file.data.id}`);

        // Try to make file readable by anyone
        try {
          await drive.permissions.create({
            fileId: file.data.id,
            requestBody: {
              role: 'reader',
              type: 'anyone',
            },
          });
          console.log('Google Drive file permissions set to: Public Reader.');
        } catch (permError) {
          console.warn('Could not set Google Drive public permissions:', permError.message);
        }

        return file.data.webViewLink || file.data.webContentLink || localUrl;

      } catch (err) {
        console.error('Google Drive upload failed. Falling back to local static serving:', err);
        return localUrl;
      }
    } else {
      console.log('Google Drive archiving is unconfigured. Serving report statically.');
      return localUrl;
    }
  }
}
