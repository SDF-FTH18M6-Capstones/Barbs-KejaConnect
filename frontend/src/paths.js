export const ROUTES = {
  home: "/",
  listings: "/listings",
  listing: (id) => `/listings/${id}`,
  login: "/login",
  register: "/signup",
};

export const ADMIN = {
  home: "/admin_dashboard",
  approvalQueue: "/admin_dashboard/approval_queue",
  posterReview: "/admin_dashboard/poster_review",
  stats: "/admin_dashboard/stats",
  reports: "/admin_dashboard/reports",
  newListing: "/admin_dashboard/new_listing",
};