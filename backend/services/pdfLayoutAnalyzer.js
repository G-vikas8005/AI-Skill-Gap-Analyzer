import fs from "fs";
// import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

/**
 * FIX: PDF worker setup (IMPORTANT)
 */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
);

/**
 * ========================================
 * ATS PDF LAYOUT ANALYZER
 * ========================================
 */
export const analyzePDFLayout = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fontSizes = [];
    let totalTextItems = 0;

    let hasLargeHeading = false;
    let hasMultipleColumns = false;

    const issues = [];
    const recommendations = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      totalTextItems += content.items.length;

      const xPositions = [];

      content.items.forEach((item) => {
        if (!item.transform) return;

        // FIXED font size extraction
        const fontSize = Math.abs(item.transform?.[0] || 0);

        if (fontSize > 0) fontSizes.push(fontSize);

        if (fontSize >= 16) {
          hasLargeHeading = true;
        }

        xPositions.push(item.transform?.[4] || 0);
      });

      const leftSide = xPositions.filter((x) => x < 250).length;
      const rightSide = xPositions.filter((x) => x > 300).length;

      if (leftSide > 15 && rightSide > 15) {
        hasMultipleColumns = true;
      }
    }

    const averageFontSize =
      fontSizes.length > 0
        ? Number(
            (
              fontSizes.reduce((a, b) => a + b, 0) /
              fontSizes.length
            ).toFixed(1)
          )
        : 0;

    let atsScore = 100;

    if (pdf.numPages > 2) {
      atsScore -= 10;
      issues.push("Resume exceeds 2 pages.");
      recommendations.push("Keep resume within 1–2 pages.");
    }

    if (hasMultipleColumns) {
      atsScore -= 15;
      issues.push("Multi-column layout detected.");
      recommendations.push("Use single-column format for ATS compatibility.");
    }

    if (averageFontSize > 0 && averageFontSize < 10) {
      atsScore -= 10;
      issues.push("Font size too small.");
      recommendations.push("Use font size between 10–12.");
    }

    if (!hasLargeHeading) {
      atsScore -= 10;
      issues.push("Weak or missing section headings.");
      recommendations.push("Use clear headings like EXPERIENCE, SKILLS.");
    }

    if (totalTextItems < 80) {
      atsScore -= 5;
      issues.push("Low content detected.");
      recommendations.push("Add more experience/projects.");
    }

    atsScore = Math.max(0, Math.min(100, atsScore));

    return {
      atsScore,
      pages: pdf.numPages,
      columns: hasMultipleColumns ? 2 : 1,
      fonts:
        fontSizes.length > 0
          ? [`Average Size ${averageFontSize}px`]
          : [],
      marginStatus: "Standard",

      hasTables: false,
      hasImages: false,
      hasIcons: false,
      hasColors: false,

      issues,
      recommendations,
    };
  } catch (error) {
    console.error("❌ PDF Layout Analysis Error:", error);

    return {
      atsScore: 0,
      pages: 0,
      columns: 1,
      fonts: [],
      marginStatus: "Unknown",

      hasTables: false,
      hasImages: false,
      hasIcons: false,
      hasColors: false,

      issues: ["Failed to analyze resume layout."],
      recommendations: [],
    };
  }
};