import { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const DocumentContext = createContext(null);

const uploadState = {
  data: null,
  loading: false,
  error: null,
};
const docsState = {
  items: [],
  page: 1,
  per_page: 10,
  total: 0,
  pages: 0,
  loading: false,
  error: null,
};
function handleUpload(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: false };
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function handleDocs(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: false };
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        page: action.payload.page,
        per_page: action.payload.per_page,
        total: action.payload.total,
        pages: action.payload.pages,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_PAGE":
      return { ...state, loading: false, page: action.payload };
    case "SET_PER_PAGE":
      return { ...state, loading: false, per_page: action.payload, page: 1 };
    default:
      return state;
  }
}
export function DocumentsProvider({ children }) {
  const [uploadData, uploadDispatch] = useReducer(handleUpload, uploadState);
  const [documentsData, documentsDispatch] = useReducer(handleDocs, docsState);
  async function uploadDocument(doc_type, file) {
    uploadDispatch({ type: "INIT" });
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized user.");
    }
    try {
      const form = new FormData();
      form.append("doc_type", doc_type);
      form.append("files", file);
      const res = await fetch("/api/v1/verification/documents", {
        method: "POST",
        body: form,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to upload documents.");
      const data = await res.json();
      uploadDispatch({ type: "SUCCESS", payload: data.verification_doc });
    } catch (error) {
      uploadDispatch({ type: "ERROR", payload: error.message });
    } finally {
      uploadDispatch({ type: "INIT" });
    }
  }

  async function getDocuments() {
    documentsDispatch({ type: "INIT" });
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized user.");
    }
    try {
      const res = await fetch("/api/v1/verification/documents", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to retreive documents.");
      const data = await res.json();
      documentsDispatch({ type: "SUCCESS", payload: data });
    } catch (error) {
      documentsDispatch({ type: "ERROR", payload: error.message });
    } finally {
      documentsDispatch({ type: "INIT" });
    }
  }

  const value = { uploadData, documentsData, uploadDocument, getDocuments };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === null || context === undefined) {
    throw new Error("Cannot use DocumentsContext outside of provider.");
  }
  return context;
}
