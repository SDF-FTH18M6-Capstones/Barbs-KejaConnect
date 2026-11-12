// Usage in the main router:
//   import { listingRoutes, inquiryRoutes } from "./routes/SignupRoutes";
//
//   export const router = createBrowserRouter([
//     ...
//     ...listingRoutes,
//     ...inquiryRoutes,
//   ]);
import ListingDetail from "../pages/ListingDetail";
import MyInquiries from "../pages/MyInquiries";

export const listingRoutes = [
  { path: "/listings/:id", element: <ListingDetail /> },
];

export const inquiryRoutes = [
  { path: "/my-inquiries", element: <MyInquiries /> },
];
