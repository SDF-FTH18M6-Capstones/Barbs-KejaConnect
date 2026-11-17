export const DOC_LABELS = {
  national_id: "National ID",
  title_deed: "Title deed",
  management_agreement: "Management agreement",
};

export const REQUIRED_DOCS = {
  owner: ["national_id", "title_deed"],
  manager: ["national_id", "management_agreement"],
};

export const MAX_FILE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ALLOWED_EXT = /\.(jpe?g|png|pdf)$/i;

export function checkFile(file) {
  if (!file) return "Choose a file to upload";
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.test(file.name)) {
    return "Upload a JPG, PNG or PDF file";
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return `The file is larger than ${MAX_FILE_MB} MB`;
  }
  return "";
}

export function latestByType(documents = []) {
  const latest = {};
  for (const d of documents) {
    if (
      !latest[d.doc_type] ||
      new Date(d.created_at) > new Date(latest[d.doc_type].created_at)
    ) {
      latest[d.doc_type] = d;
    }
  }
  return latest;
}
