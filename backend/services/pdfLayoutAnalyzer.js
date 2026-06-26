import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const analyzePDFLayout = async (filePath) => {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    const pages = pdf.numPages;

    let fontSizes = [];
    let totalTextItems = 0;

    let hasLargeHeading = false;
    let hasMultipleColumns = false;

    const issues = [];
    const recommendations = [];

    for (let pageNum = 1; pageNum <= pages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      totalTextItems += content.items.length;

      const xPositions = [];

      content.items.forEach((item) => {
        if (!item.transform) return;

        const fontSize = Math.round(item.transform[0]);

        if (fontSize > 0) {
          fontSizes.push(fontSize);
        }

        if (fontSize >= 16) {
          hasLargeHeading = true;
        }

        xPositions.push(item.transform[4]);
      });

      const leftSide = xPositions.filter((x) => x < 250).length;
      const rightSide = xPositions.filter((x) => x > 300).length;

      if (leftSide > 20 && rightSide > 20) {
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

        // Prevent negative score
    atsScore = Math.max(0, Math.min(100, atsScore));

    return {
      atsScore,
      pages,

      // IMPORTANT:
      // Frontend expects a NUMBER (1 or 2), not "Single"/"Multiple"
      columns: hasMultipleColumns ? 2 : 1,

      fonts:
        fontSizes.length > 0
          ? [`Average Size ${averageFontSize}px`]
          : [],

      marginStatus: "Standard",

      // Future enhancements
      hasTables: false,
      hasImages: false,
      hasIcons: false,
      hasColors: false,

      issues,
      recommendations,
    };
  } catch (error) {
    console.error("PDF Layout Analysis Error:", error);

    return {
      atsScore: 0,
      pages: 0,

      // Keep the same datatype even on error
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