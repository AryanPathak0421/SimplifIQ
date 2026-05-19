import nodemailer from 'nodemailer';
import path from 'path';

export class EmailService {
  static async sendReport(leadData, pdfPath) {
    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    let transporter;
    let etherealUrl = null;

    if (isSmtpConfigured) {
      console.log('Sending email using configured SMTP transporter...');
      
      const config = process.env.SMTP_HOST.includes('gmail') 
        ? {
            service: 'gmail',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          }
        : {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          };

      transporter = nodemailer.createTransport(config);
    } else {
      console.log('No SMTP config found. Generating temporary Ethereal Mail credentials...');
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: testAccount.host,
          port: testAccount.port,
          secure: testAccount.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (err) {
        console.error('Failed to create Ethereal Mail test account:', err);
        throw new Error('Email delivery mechanism could not be initialized.');
      }
    }

    const companyName = leadData.companyName || 'your company';
    const challenge = leadData.challenge || 'Digital Strategy';
    const fileName = path.basename(pdfPath);

    // Styling the email beautifully in HTML
    const mailOptions = {
      from: isSmtpConfigured ? `"${process.env.SMTP_USER}"` : '"SimplifIQ Advisory" <reports@simplifiq.com>',
      to: leadData.email,
      subject: `SimplifIQ Diagnostic Audit Report - ${companyName}`,
      text: `Hi ${leadData.name},\n\nWe ran a digital diagnostic audit of your online presence for ${companyName} to address your goal of: "${challenge}".\n\nPlease find your fully personalized report attached to this email.\n\nBest regards,\nSimplifIQ Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;">
          <div style="background-color: #0f172a; padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">SIMPLIFIQ ADVISORY</h1>
            <p style="color: #0284c7; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 2px;">GROWTH ENGINE DIAGNOSTIC</p>
          </div>
          
          <div style="padding: 25px; background-color: #ffffff;">
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hi <strong>${leadData.name}</strong>,</p>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
              Thank you for requesting an assessment. We have run a comprehensive automated analysis of <strong>${companyName}</strong>'s online presence, specifically addressing your challenge of: <em>"${challenge}"</em>.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 15px; margin: 25px 0; border-radius: 0 4px 4px 0;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #0f172a;">What's Inside Your Audit Report:</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #475569;">
                <li><strong>Ecosystem Scorecard:</strong> Quantitative analysis of SEO, load times, and call-to-actions.</li>
                <li><strong>Tailored SWOT Grid:</strong> Identifying immediate security threats and scaling opportunities.</li>
                <li><strong>Growth Action Plan:</strong> Chronological priority roadmap with estimated business ROI.</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              We have attached a premium, print-ready PDF containing the full, deeply personalized strategy. Please review the attachment to view our detailed findings.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:partners@simplifiq.com?subject=Strategic Audit Implementation Call" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">Schedule Strategy Call</a>
            </div>
            
            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
              Best regards,<br>
              <strong>SimplifIQ Growth Advisor Team</strong><br>
              <span style="font-size: 11px;">reports@simplifiq.com</span>
            </p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #64748b;">
            This email is an automated deliverable sent on behalf of SimplifIQ Advisory Group.<br>
            © 2026 SimplifIQ. All rights reserved.
          </div>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully processed! Message ID: ${info.messageId}`);

    if (!isSmtpConfigured) {
      etherealUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[ETHEREAL INBOX] View sent email here: ${etherealUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      etherealUrl
    };
  }
}
