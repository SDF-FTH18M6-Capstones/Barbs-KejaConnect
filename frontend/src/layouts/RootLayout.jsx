import { Outlet } from "react-router-dom";
import { AuthProvider } from "../providers/AuthProvider";
import { ListingsProvider } from "../providers/ListingsProvider";
import { InquiriesProvider } from "../providers/InquiriesProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <InquiriesProvider>
          <Outlet />
        </InquiriesProvider>
      </ListingsProvider>
    </AuthProvider>
  );
}
