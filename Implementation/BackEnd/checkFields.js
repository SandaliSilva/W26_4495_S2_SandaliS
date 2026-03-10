const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function logFields() {
  try {
    const templatePath = path.join(__dirname, 'assets/wsbc_template.pdf');
    const buffer = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log(`--- Found ${fields.length} fields ---`);

    if (fields.length === 0) {
      console.log("⚠️ No standard fields found. This is an XFA form.");
      console.log("Try checking if the 'topmostSubform' mapping works by default.");
    }

    fields.forEach(field => {
      const type = field.constructor.name;
      const name = field.getName();
      console.log(`[${type}] Name: ${name}`);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

logFields();