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

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      totalTextItems += content.items.length;

      const xPositions = [];

      content.items.forEach((item) => {
        if (!item.transform) return;

        const fontSize = Math.round(item.transform[0]);

        if (fontSize > 0) fontSizes.push(fontSize);
        if (fontSize >= 16) hasLargeHeading = true;

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

    if (pages > 2) {
      atsScore -= 10;
      issues.push("Resume exceeds 2 pages.");
      recommendations.push("Keep resume within 1-2 pages.");
    }

    if (hasMultipleColumns) {
      atsScore -= 15;
      issues.push("Multi-column layout detected.");
      recommendations.push("Use single-column format.");
    }

    if (averageFontSize > 0 && averageFontSize < 10) {
      atsScore -= 10;
      issues.push("Font size is too small.");
      recommendations.push("Use font size 10–12.");
    }

    if (!hasLargeHeading) {
      atsScore -= 10;
      issues.push("Section headings not clearly visible.");
      recommendations.push("Use larger headings.");
    }

    if (totalTextItems < 100) {
      atsScore -= 5;
      issues.push("Resume content appears limited.");
      recommendations.push("Add more experience/projects.");
    }

    if (atsScore < 0) atsScore = 0;

    return {
      atsScore,
      pages,

      columns: hasMultipleColumns ? "Multiple" : "Single",

      fonts: [`Average Size ${averageFontSize}px`],

      marginStatus: "Standard",

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
      columns: "Unknown",
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