import { Outlet } from "react-router-dom";
import { DocumentsProvider } from "../providers/DocumentsProvider";

export default function DocumentsLayout() {
  return (
    <DocumentsProvider>
      <Outlet />
    </DocumentsProvider>
  );
}
