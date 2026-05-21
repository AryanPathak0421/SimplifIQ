import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export class DriveService {
  static async uploadPDF(filePath, companyName) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const fileName = path.basename(filePath);
    
    // Default local fallback URL
    const localUrl = `/reports/${fileName}`;

    if (folderId && (credentialsJson || credentialsPath)) {
      try {
        console.log('Uploading PDF to Google Drive...');

        const resolvedCredentials = credentialsJson
          || (credentialsPath && credentialsPath.trim().startsWith('{') ? credentialsPath : null)
          || (credentialsPath && fs.existsSync(credentialsPath) ? null : null);

        const useFilePath = credentialsPath && !credentialsPath.trim().startsWith('{') && fs.existsSync(credentialsPath);

        const authOptions = resolvedCredentials
          ? {
              credentials: JSON.parse(resolvedCredentials),
              scopes: ['https://www.googleapis.com/auth/drive.file'],
            }
          : useFilePath
            ? {
                keyFile: credentialsPath,
                scopes: ['https://www.googleapis.com/auth/drive.file'],
              }
            : null;

        if (!authOptions) {
          console.warn('Google Drive credentials were provided, but the value is neither valid JSON nor a readable file path.');
          return localUrl;
        }

        const auth = new google.auth.GoogleAuth(authOptions);

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
          supportsAllDrives: true,
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
            supportsAllDrives: true,
          });
          console.log('Google Drive file permissions set to: Public Reader.');
        } catch (permError) {
          console.warn('Could not set Google Drive public permissions:', permError.message);
        }

        return file.data.webViewLink || file.data.webContentLink || localUrl;

      } catch (err) {
        console.error('Google Drive upload failed. Falling back to local static serving:', err);
        if (err?.errors?.some((e) => e?.reason === 'storageQuotaExceeded')) {
          console.error('Drive upload requires a Shared Drive or delegated user account. Service accounts cannot use regular My Drive storage quota.');
        }
        if (err?.errors?.some((e) => e?.reason === 'insufficientParentPermissions')) {
          console.error('The target folder must be inside a Shared Drive and shared with the service account email with Editor access.');
        }
        return localUrl;
      }
    } else {
      console.log('Google Drive archiving is unconfigured. Serving report statically.');
      return localUrl;
    }
  }
}
