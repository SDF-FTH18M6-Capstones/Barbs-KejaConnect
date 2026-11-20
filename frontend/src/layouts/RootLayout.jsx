import { Outlet } from "react-router-dom";
import { AuthProvider } from "../providers/AuthProvider";
import { ListingsProvider } from "../providers/ListingsProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <Outlet />
      </ListingsProvider>
    </AuthProvider>
  );
}
