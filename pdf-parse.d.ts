declare module "pdf-parse" {
  interface PdfParseResult {
    text: string;
    numpages?: number;
    [key: string]: unknown;
  }

  function pdf(dataBuffer: Buffer): Promise<PdfParseResult>;
  export = pdf;
}
