export const ROUTES = {
  home: "/",
  listings: "/listings",
  listing: (id) => `/listings/${id}`,
  login: "/login",
  register: "/signup",
  myInquiries: "/my-inquiries",
};

export const POSTER = {
  home: "/poster_dashboard",
  listings: "/poster_dashboard/listings",
  newListing: "/poster_dashboard/listings/new",
  editListing: (id) => `/poster_dashboard/listings/${id}/edit`,
  inquiries: "/poster_dashboard/inquiries",
  verification: "/poster_dashboard/verification",
};
