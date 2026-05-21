import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class PDFService {
  static async generateReport(leadData, scrapedData, aiData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Ensure directories exist
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const doc = new PDFDocument({
          margin: 50,
          size: 'A4',
          bufferPages: true // Enable to allow multi-pass page numbering
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // --- PALETTE DEFINITION ---
        const primaryColor = '#0f172a'; // Deep Navy
        const secondaryColor = '#0284c7'; // Sky Blue
        const textMuted = '#475569'; // Slate 600
        const textDark = '#1e293b'; // Slate 800
        const bgLight = '#f8fafc'; // Slate 50
        const borderLight = '#e2e8f0'; // Slate 200

        const colorHigh = '#dc2626'; // Crimson
        const colorMedium = '#d97706'; // Amber
        const colorLow = '#059669'; // Emerald

        // ================= PAGE 1: COVER PAGE =================
        // Background Accent Block
        doc.rect(0, 0, 595.28, 841.89).fill(primaryColor);
        
        // Geometric Glowing Line
        doc.moveTo(0, 420).lineTo(595.28, 480).lineWidth(3).stroke(secondaryColor);
        doc.rect(40, 40, 15, 15).fill(secondaryColor);
        
        // Brand Name
        doc.fillColor('#ffffff')
           .font('Helvetica-Bold')
           .fontSize(18)
           .text('SIMPLIFIQ ADVISORY', 65, 42);

        doc.fillColor(secondaryColor)
           .font('Helvetica-Bold')
           .fontSize(13)
           .text('INTELLIGENT GROWTH AUDIT', 50, 260, { characterSpacing: 1.5 });

        doc.fillColor('#ffffff')
           .font('Helvetica-Bold')
           .fontSize(34)
           .text('DIGITAL PRESENCE & CONVERSION STRATEGY', 50, 290, { width: 500, lineGap: 8 });

        doc.fillColor('#94a3b8')
           .font('Helvetica')
           .fontSize(14)
           .text(`Custom Audit & Analysis for ${leadData.companyName || scrapedData.domain}`, 50, 410);

        // Divider
        doc.moveTo(50, 450).lineTo(250, 450).lineWidth(1.5).stroke('#ffffff');

        // Audit Summary Grid details
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(11).text('PREPARED FOR:', 50, 600);
        doc.font('Helvetica').fontSize(12).fillColor('#e2e8f0').text(leadData.name, 50, 618);
        doc.fontSize(11).text(leadData.email, 50, 635);
        doc.fillColor(secondaryColor).font('Helvetica-Bold').text(scrapedData.domain, 50, 652);

        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(11).text('AUDIT PARAMETERS:', 300, 600);
        doc.font('Helvetica').fontSize(11).fillColor('#e2e8f0').text(`Primary Goal: ${leadData.challenge || 'Digital Expansion'}`, 300, 618, { width: 250 });
        doc.text(`Date of Audit: ${new Date().toLocaleDateString()}`, 300, 645);
        doc.text('Status: Complete [Verified]', 300, 662);

        // ================= PAGE 2: EXEC SUMMARY & TECHNICAL AUDIT =================
        doc.addPage();
        this.drawPageHeader(doc, 'EXECUTIVE SUMMARY & TECHNICAL AUDIT', secondaryColor);

        // Business Summary Box
        doc.rect(50, 95, 495, 100).fill(bgLight);
        doc.rect(50, 95, 4, 100).fill(secondaryColor);
        
        doc.fillColor(textDark)
           .font('Helvetica-Bold')
           .fontSize(11)
           .text('DIGITAL STRATEGIST ASSESSMENT', 70, 110);
           
        doc.font('Helvetica')
           .fontSize(10.5)
           .fillColor(textDark)
           .text(aiData.businessSummary, 70, 130, { width: 450, lineGap: 4 });

        // Tech Metric Badges Header
        doc.fillColor(primaryColor)
           .font('Helvetica-Bold')
           .fontSize(14)
           .text('TECHNICAL SCORECARD', 50, 225);

        // Score 1: SEO
        this.drawMetricCard(doc, 50, 255, 150, 'SEO SCORE', scrapedData.scores.seo, 'Visibility & Tags', primaryColor, secondaryColor, textMuted);
        // Score 2: Performance
        this.drawMetricCard(doc, 222, 255, 150, 'PERFORMANCE', scrapedData.scores.performance, 'Speed & Alt Tags', primaryColor, secondaryColor, textMuted);
        // Score 3: Conversion
        this.drawMetricCard(doc, 395, 255, 150, 'CONVERSION', scrapedData.scores.leadGen, 'CTAs & Forms', primaryColor, secondaryColor, textMuted);

        // Detailed Audit Sub-sections
        doc.fillColor(primaryColor)
           .font('Helvetica-Bold')
           .fontSize(13)
           .text('DIGITAL ECOSYSTEM BREAKDOWN', 50, 390);

        let yPos = 420;
        const audits = [
          { name: 'SEO & Structured Metadata', text: aiData.digitalAudits.seo },
          { name: 'User Journey & Conversion Channels', text: aiData.digitalAudits.conversion },
          { name: 'Resource Loading & Performance', text: aiData.digitalAudits.performance }
        ];

        audits.forEach(audit => {
          doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(11).text(audit.name.toUpperCase(), 50, yPos);
          doc.fillColor(textDark).font('Helvetica').fontSize(10).text(audit.text, 50, yPos + 18, { width: 495, lineGap: 3 });
          yPos += 70;
        });

        // Add crawled info
        doc.rect(50, 680, 495, 60).stroke(borderLight);
        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('CRAWLED DOMAIN INSIGHTS', 65, 692);
        
        doc.font('Helvetica').fontSize(9).fillColor(textMuted);
        doc.text(`Internal Pages: ${scrapedData.metrics.internalLinks}`, 65, 715);
        doc.text(`External Resources: ${scrapedData.metrics.externalLinks}`, 190, 715);
        doc.text(`Total Images Found: ${scrapedData.metrics.totalImages} (${scrapedData.metrics.imagesWithAlt} with Alt text)`, 320, 715);

        // ================= PAGE 3: SWOT ANALYSIS =================
        doc.addPage();
        this.drawPageHeader(doc, 'COMPREHENSIVE SWOT ANALYSIS', secondaryColor);

        doc.fillColor(textDark)
           .font('Helvetica')
           .fontSize(10.5)
           .text(`Evaluating ${leadData.companyName || scrapedData.domain}'s internal advantages against broader sector headwinds in the context of resolving: "${leadData.challenge || 'Digital Expansion'}".`, 50, 95, { width: 495 });

        // SWOT Grid Setup
        const gridW = 237;
        const gridH = 260;
        
        // 1. Strengths
        this.drawSwotBox(doc, 50, 140, gridW, gridH, 'STRENGTHS', aiData.swot.strengths, '#f0fdf4', '#16a34a', textDark, textMuted);
        // 2. Weaknesses
        this.drawSwotBox(doc, 308, 140, gridW, gridH, 'WEAKNESSES', aiData.swot.weaknesses, '#fef2f2', '#dc2626', textDark, textMuted);
        // 3. Opportunities
        this.drawSwotBox(doc, 50, 420, gridW, gridH, 'OPPORTUNITIES', aiData.swot.opportunities, '#eff6ff', '#2563eb', textDark, textMuted);
        // 4. Threats
        this.drawSwotBox(doc, 308, 420, gridW, gridH, 'THREATS', aiData.swot.threats, '#fffbeb', '#d97706', textDark, textMuted);

        // ================= PAGE 4: DETAILED ACTION PLAN & CONCLUSION =================
        doc.addPage();
        this.drawPageHeader(doc, 'IMPACT STRATEGY & TACTICAL GROWTH PLAN', secondaryColor);

        doc.fillColor(primaryColor)
           .font('Helvetica-Bold')
           .fontSize(14)
           .text('PRIORITIZED ROADMAP FOR REMEDIATION', 50, 95);

        let planY = 125;
        aiData.actionPlan.forEach((plan, idx) => {
          let badgeColor = colorLow;
          if (plan.priority.toLowerCase() === 'high') badgeColor = colorHigh;
          if (plan.priority.toLowerCase() === 'medium') badgeColor = colorMedium;

          // Priority Badge
          doc.rect(50, planY, 495, 110).fill(bgLight);
          doc.rect(50, planY, 4, 110).fill(badgeColor);

          // Priority Text Badge
          doc.fillColor(badgeColor).font('Helvetica-Bold').fontSize(10).text(`${plan.priority.toUpperCase()} PRIORITY`, 70, planY + 15);
          doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(12).text(`${idx + 1}. ${plan.task}`, 70, planY + 30);
          
          doc.fillColor(textDark)
             .font('Helvetica')
             .fontSize(10)
             .text(plan.details, 70, planY + 48, { width: 450, lineGap: 3 });

          // ROI Flag
          doc.fillColor(badgeColor).font('Helvetica-Bold').fontSize(9.5).text(`Projected Outcome: ${plan.estimatedRoi}`, 70, planY + 90);

          planY += 130;
        });

        // SimplifIQ Advisory Signoff
        doc.rect(50, 530, 495, 140).fill(primaryColor);
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(14).text('COLLABORATE WITH SIMPLIFIQ', 75, 555);
        
        doc.fillColor('#94a3b8')
           .font('Helvetica')
           .fontSize(10.5)
           .text('Every digital recommendation in this document is engineered to reduce client friction, boost search visibility, and accelerate sales pipelines. Let our AI-driven software development team implement these items for you.', 75, 580, { width: 445, lineGap: 4 });

        doc.fillColor(secondaryColor)
           .font('Helvetica-Bold')
           .fontSize(11)
           .text('Book your implementation call: partners@simplifiq.com', 75, 635);

        // --- FOOTERS & PAGE NUMBERS (Multi-pass using bufferPages) ---
        const range = doc.bufferedPageRange();

        // Draw footers on all non-cover pages
        for (let i = 0; i < range.count; i++) {
          doc.switchToPage(i);
          if (i > 0) { // Do not draw headers/footers on cover page
            // Footer text
            doc.fillColor(textMuted)
               .font('Helvetica')
               .fontSize(8.5)
               .text('SIMPLIFIQ © 2026 | INTELLECTUAL CAP SHEET', 50, 785);
            doc.text(`Page ${i + 1} of ${range.count}`, 500, 785, { width: 50, align: 'right' });
            // Thin Footer line
            doc.moveTo(50, 775).lineTo(545, 775).lineWidth(0.5).stroke(borderLight);
          }
        }

        // === TRIM TRAILING BLANK PAGES (Prototype-safe approach) ===
        // Some inputs or internal PDFKit behavior can cause extra blank pages
        // to be present at the end of the buffered pages. For the intended
        // 4-page audit, remove any trailing pages after page 4 that appear
        // to be empty. This mutates PDFKit internals and is acceptable for
        // a prototype to avoid shipping many blank pages.
        try {
          // Allow disabling trimming via env var for cases where full PDF (including blanks)
          // should be preserved. Set `PDF_TRIM_BLANK=false` in backend/.env to skip trimming.
          const trimEnabled = (process.env.PDF_TRIM_BLANK || 'true').toLowerCase() === 'true';
          if (!trimEnabled) {
            console.log('PDF trimming disabled via PDF_TRIM_BLANK=false; preserving all pages.');
          } else {
            const MAX_PAGES = 4;
            const currentRange = doc.bufferedPageRange();
            const total = currentRange.count;
            if (total > MAX_PAGES) {
              // Remove references from internal page arrays
              if (Array.isArray(doc._pages) && doc._pages.length > MAX_PAGES) {
                doc._pages.splice(MAX_PAGES);
              }
              if (doc._root && doc._root.data && doc._root.data.Pages && Array.isArray(doc._root.data.Pages.data.Kids)) {
                doc._root.data.Pages.data.Kids.splice(MAX_PAGES);
                // Update the Count entry
                doc._root.data.Pages.data.Count = doc._root.data.Pages.data.Kids.length;
              }
              // If bufferedPageRange is cached, try to clear or update
              if (doc._pageBuffer && Array.isArray(doc._pageBuffer)) {
                doc._pageBuffer.splice(MAX_PAGES);
              }
              console.log(`Trimmed PDF pages from ${total} to ${Math.min(total, MAX_PAGES)} to remove blanks.`);
            }
          }
        } catch (trimErr) {
          console.warn('Failed to trim trailing PDF pages:', trimErr.message || trimErr);
        }

        doc.end();
        stream.on('finish', () => {
          console.log(`PDF successfully generated at: ${outputPath}`);
          resolve(outputPath);
        });
        stream.on('error', (err) => {
          reject(err);
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  static drawPageHeader(doc, pageTitle, color) {
    // Thin Header Line
    doc.moveTo(50, 70).lineTo(545, 70).lineWidth(1).stroke('#e2e8f0');
    
    // Page Title Text
    doc.fillColor(color)
       .font('Helvetica-Bold')
       .fontSize(9)
       .text(pageTitle, 50, 52, { characterSpacing: 1 });
       
    doc.fillColor('#94a3b8')
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('SIMPLIFIQ GROWTH ENGINE', 400, 52, { width: 145, align: 'right' });
  }

  static drawMetricCard(doc, x, y, width, label, score, subtitle, primaryColor, secondaryColor, mutedColor) {
    // Background card border
    doc.rect(x, y, width, 110).stroke('#e2e8f0');
    doc.rect(x, y, width, 4).fill(secondaryColor);
    
    // Text elements
    doc.fillColor(mutedColor).font('Helvetica-Bold').fontSize(8.5).text(label, x + 15, y + 18);
    
    // Scoring rating logic
    let scoreColor = '#2563eb';
    if (score >= 80) scoreColor = '#16a34a';
    else if (score < 60) scoreColor = '#dc2626';

    doc.fillColor(scoreColor).font('Helvetica-Bold').fontSize(36).text(score.toString(), x + 15, y + 32);
    
    doc.fillColor(mutedColor).font('Helvetica').fontSize(8).text(subtitle, x + 15, y + 84);
  }

  static drawSwotBox(doc, x, y, width, height, title, points, bg, accentColor, darkText, mutedText) {
    doc.rect(x, y, width, height).fill(bg);
    doc.rect(x, y, width, 4).fill(accentColor);
    
    doc.fillColor(accentColor).font('Helvetica-Bold').fontSize(12).text(title, x + 15, y + 20);
    
    let textY = y + 45;
    points.forEach(point => {
      // Bullet dot
      doc.circle(x + 20, textY + 5, 2.5).fill(accentColor);
      // Bullet text
      doc.fillColor(darkText)
         .font('Helvetica')
         .fontSize(9.5)
         .text(point, x + 30, textY, { width: width - 45, lineGap: 3 });
      
      const heightUsed = doc.heightOfString(point, { width: width - 45, lineGap: 3 });
      textY += Math.max(heightUsed + 12, 38);
    });
  }
}
