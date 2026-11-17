import { api } from "./client";
import * as mock from "./mockApi";
import { USE_MOCKS } from "./config";

// Documents the logged-in poster has uploaded, newest first
export const getMyDocuments = (params) =>
  USE_MOCKS
    ? mock.getMyDocuments(params)
    : api("/verification/documents", { params, auth: true });

// docType: "national_id" | "title_deed" | "management_agreement"
// file: a jpg, png or pdf of 5 MB or less. Sent as multipart form data.
export function uploadDocument(docType, file) {
  const form = new FormData();
  form.append("doc_type", docType);
  form.append("file", file);
  return USE_MOCKS
    ? mock.uploadDocument(form)
    : api("/verification/documents", {
        method: "POST",
        body: form,
        auth: true,
      });
}
