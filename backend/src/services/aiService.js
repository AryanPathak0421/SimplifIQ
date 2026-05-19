import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  static async analyze(leadData, scrapedData) {
    const apiKey = process.env.GEMINI_API_KEY;
    const companyName = leadData.companyName || scrapedData.title.split('|')[0].trim();
    const challenge = leadData.challenge || 'General Digital Growth';
    const email = leadData.email;
    const leadName = leadData.name;
    const website = scrapedData.url;

    if (apiKey && apiKey.trim() !== '') {
      try {
        console.log('Generating AI analysis via Gemini API...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
          You are an expert Digital Strategy Consultant & Growth Marketer.
          You have captured a lead with the following profile:
          - Lead Name: ${leadName}
          - Work Email: ${email}
          - Company Name: ${companyName}
          - Website: ${website}
          - Core Business Challenge / Goal: ${challenge}

          Here is the web scraped data from their homepage:
          - Page Title: ${scrapedData.title}
          - Meta Description: ${scrapedData.description}
          - Primary Headers (H1): ${JSON.stringify(scrapedData.h1s)}
          - Secondary Headers (H2): ${JSON.stringify(scrapedData.h2s)}
          - Metrics: Total Images: ${scrapedData.metrics.totalImages}, Images With Alt: ${scrapedData.metrics.imagesWithAlt}, Internal Links: ${scrapedData.metrics.internalLinks}, External Links: ${scrapedData.metrics.externalLinks}
          - Tech Scores calculated locally: SEO Score: ${scrapedData.scores.seo}/100, Speed Index Score: ${scrapedData.scores.performance}/100, Lead Generation Rating: ${scrapedData.scores.leadGen}/100

          Perform a deep analysis and generate a growth audit report. Your response MUST be valid JSON and ONLY valid JSON, with no markdown wrappers or backticks. Format it exactly as follows:
          {
            "businessSummary": "A concise, professional 3-4 sentence summary of what the company does based on their website copy, identifying their sector and digital position.",
            "targetAudienceAnalysis": "Detail their apparent target customer segments (B2B, B2C, specific verticals) and their likely purchasing triggers.",
            "swot": {
              "strengths": ["Strength 1 (e.g. clear value statement)", "Strength 2"],
              "weaknesses": ["Weakness 1 (e.g. low descriptive headers, missing alt texts)", "Weakness 2"],
              "opportunities": ["Opportunity 1 (e.g. add a lead capture form or calendar scheduling)", "Opportunity 2"],
              "threats": ["Threat 1 (e.g. heavy competition in their SEO niche)", "Threat 2"]
            },
            "digitalAudits": {
              "seo": "Detailed critique of their SEO, including recommendations based on their meta tags and headers.",
              "conversion": "Critique of their lead generation capability, explaining why they are losing prospects and how to improve visual call-to-actions.",
              "performance": "Critique of their loading speed and responsive accessibility, citing their image alt percentages and response times."
            },
            "actionPlan": [
              {
                "priority": "High",
                "task": "Concrete task name",
                "details": "Explanation of what to do, why it matters, and how it directly solves their core challenge (${challenge}).",
                "estimatedRoi": "Short estimate of business return (e.g. '+20% signup conversion rate')"
              },
              {
                "priority": "Medium",
                "task": "Second task name",
                "details": "Details on implementation.",
                "estimatedRoi": "Short estimate"
              },
              {
                "priority": "Low",
                "task": "Third task name",
                "details": "Details on implementation.",
                "estimatedRoi": "Short estimate"
              }
            ],
            "outreachEmail": "A highly personalized, empathetic, value-first B2B outreach email pitch from a SimplifIQ digital advisor to the lead (${leadName}) showing we researched their site and can help solve their challenge of '${challenge}' with the concrete action items above. Keep the tone warm, consultative, and low-friction, offering a quick calendar call."
          }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Sanitize the response text to extract valid JSON
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();

        const jsonResult = JSON.parse(cleanText);
        return jsonResult;

      } catch (err) {
        console.error('Gemini API call failed, falling back to expert rule-based engine:', err);
      }
    } else {
      console.log('GEMINI_API_KEY is not defined. Using expert rule-based fallback engine.');
    }

    // Expert rule-based engine fallback
    return this.generateHeuristicReport(companyName, challenge, leadName, scrapedData);
  }

  static generateHeuristicReport(companyName, challenge, leadName, scrapedData) {
    const domain = scrapedData.domain;
    
    // Heuristic industry determination
    let industry = 'B2B Services';
    const textToSearch = `${scrapedData.title} ${scrapedData.description} ${scrapedData.h1s.join(' ')}`.toLowerCase();
    
    if (textToSearch.includes('saas') || textToSearch.includes('software') || textToSearch.includes('platform') || textToSearch.includes('cloud')) {
      industry = 'SaaS / Tech';
    } else if (textToSearch.includes('consult') || textToSearch.includes('advis') || textToSearch.includes('partner') || textToSearch.includes('strategy')) {
      industry = 'Management Consulting & Advisory';
    } else if (textToSearch.includes('invest') || textToSearch.includes('finance') || textToSearch.includes('capital') || textToSearch.includes('wealth')) {
      industry = 'Financial Services & Wealth Management';
    } else if (textToSearch.includes('agency') || textToSearch.includes('market') || textToSearch.includes('creative') || textToSearch.includes('media')) {
      industry = 'Creative Agency & B2B Services';
    }

    const friendlyDescription = scrapedData.description && scrapedData.description.length > 30 
      ? scrapedData.description 
      : `Digital business portal representing ${companyName}, specializing in delivery of elite ${industry} solutions.`;

    // 1. SWOT Dynamic mapping
    const strengths = [
      `Established core online footprint with domain: ${domain}`,
      scrapedData.title ? `Professional website title metadata: "${scrapedData.title.substring(0, 45)}..."` : `Functional baseline web landing structure`,
      scrapedData.metrics.internalLinks > 15 ? `Healthy information depth with ${scrapedData.metrics.internalLinks} internal link pathways` : `Compact, focused user navigation structure`
    ];

    const weaknesses = [
      scrapedData.metrics.totalImages > 0 && (scrapedData.metrics.imagesWithAlt / scrapedData.metrics.totalImages) < 0.7 
        ? `SEO accessibility vulnerability: only ${scrapedData.metrics.imagesWithAlt} of ${scrapedData.metrics.totalImages} images have descriptive alt texts` 
        : `Under-optimized image payload caching protocols`,
      scrapedData.h1s.length === 0 ? 'Critical UX error: Website lacks a clear H1 page-defining header block' : `Header layout lacks strong secondary value-proposition callouts`,
      scrapedData.scores.leadGen < 60 ? 'Friction points: Lack of distinct calendars, scheduling tools, or friction-free lead magnets' : 'Generic call-to-actions that fail to address buyer persona objections'
    ];

    const opportunities = [
      `Deploy a personalized chatbot or conversational scheduler to convert site visitors looking for answers to "${challenge}"`,
      `Implement structured Schema markup (Organization & LocalBusiness) to capture rich snippets on search results`,
      `Revamp page copy headings specifically tailored to capture organic searches for "${challenge}"`
    ];

    const threats = [
      `Competitors running aggressive Google Ads targeting search terms around your niche: ${industry}`,
      `Organic SEO degradation as search engines penalize sites with high bounce rates and low keyword density`,
      `Loss of warm leads to faster-loading competitor websites (Target: <1.5s mobile loading time)`
    ];

    // 2. Dynamic Action items
    const actionPlan = [
      {
        "priority": "High",
        "task": `Header Copy Optimizations for "${challenge}"`,
        "details": `Rewrite your website header tags (H1 and H2 elements) to explicitly state your value proposition and how you solve challenges like "${challenge}". Currently, your page titles and headers do not emphasize this clearly enough for modern search algorithms or user scanning behaviors.`,
        "estimatedRoi": "+25% Visitor Engagement"
      },
      {
        "priority": "Medium",
        "task": "Friction-Free Conversational Funnel Integration",
        "details": `Introduce a modern interactive booking interface (e.g. structured multi-step forms or direct calendar links) on your homepage. The audit reveals your lead-capture capabilities score only ${scrapedData.scores.leadGen}/100. Adding high-intent triggers will drastically reduce customer acquisition costs.`,
        "estimatedRoi": "+18% Lead Conversions"
      },
      {
        "priority": "Low",
        "task": "Technical Asset Remediation & Image Alt Tags",
        "details": `Add descriptive alt attributes to your images (currently only ${scrapedData.metrics.imagesWithAlt} of ${scrapedData.metrics.totalImages} images have them) and implement modern image compression formats (WebP). This will lower mobile load times and immediately improve core SEO rankings.`,
        "estimatedRoi": "-400ms Page Load Speed"
      }
    ];

    // 3. Email Copy Draft
    const outreachEmail = `Subject: Quick feedback on ${companyName}'s digital footprint / audit notes for ${leadName}

Hi ${leadName},

I was researching ${companyName} earlier today and spent some time on your website (${domain}). We ran a quick automated digital diagnostic on your homepage footprint, particularly keeping in mind your goal of improving "${challenge}".

I wanted to share a couple of immediate opportunities I noticed that could help you move the needle:
1. Revitalizing header hooks: Incorporating your target outcomes for "${challenge}" directly into your H1 page headers will immediately lift visitor retention.
2. Conversion points: Upgrading lead mechanisms (your current lead gen index stands around ${scrapedData.scores.leadGen}/100) with interactive visual widgets can easily drive double-digit conversion gains.
3. SEO Remediation: A few standard technical items, like image alt descriptions and asset scaling, could boost your ranking performance.

I've attached a fully detailed PDF audit report compiling these findings, SWOT metrics, and direct action plans.

Are you open to a brief, 10-minute consultative brainstorming session next Tuesday or Wednesday to discuss how you could deploy these enhancements?

Best regards,

Growth Advisory Team
SimplifIQ Advisory Group
reports@simplifiq.com`;

    return {
      businessSummary: `Based on a digital audit of ${domain}, the website represents a professional operating presence in the ${industry} sector. With page titles such as "${scrapedData.title || companyName}", the brand establishes a baseline footprint, but currently displays significant performance and copywriting opportunities to properly convert modern digital visitors looking for specific ${challenge} capabilities.`,
      targetAudienceAnalysis: `High-intent clients, procurement leads, and corporate decision-makers within the ${industry} space. These users are typically triggered by immediate pain points regarding operational scale, digital service access, and trustworthy business consulting.`,
      swot: {
        strengths,
        weaknesses,
        opportunities,
        threats
      },
      digitalAudits: {
        seo: `The digital footprint of ${domain} displays a search engine index score of ${scrapedData.scores.seo}/100. Key strengths include established page metadata. Critical improvements lie in header keyword density and keyword aligning for '${challenge}'.`,
        conversion: `Conversion features index at ${scrapedData.scores.leadGen}/100. The interface lacks visual hierarchy for Call-To-Actions (CTAs) and is missing friction-free conversion magnets, causing high traffic leakage.`,
        performance: `Visual performance scores ${scrapedData.scores.performance}/100 with a loading latency of ${scrapedData.loadTimeMs}ms. Mobile asset scaling can be immediately optimized to lower bounce rates.`
      },
      actionPlan,
      outreachEmail
    };
  }
}
