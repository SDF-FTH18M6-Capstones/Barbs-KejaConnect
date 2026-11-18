export const mockAdminStats = {
  listings: 40,
  availableListings: 35,
  takenListings: 5,
  approvedPosters: 6,
  registeredPosters: 9,
  tenants: 4,
  inquiries: 14,
};

export const mockPendingApprovals = [
  {
    id: 1,
    name: "Kevin Mutua",
    email: "kevin.mutua@kejaconnect.test",
    role: "Manager",
    company: "Mutua Agencies",
    documents: ["National ID", "Management Agreement"],
    submittedAt: "2 days ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Lucy Achieng",
    email: "lucy.achieng@kejaconnect.test",
    role: "Owner",
    company: "",
    documents: ["National ID", "Title Deed"],
    submittedAt: "Yesterday",
    status: "pending",
  },
];

export const mockRecentDecisions = [
  {
    id: 3,
    name: "Dennis Kiprop",
    note: "Unsigned management agreement",
    status: "rejected",
  },
  {
    id: 4,
    name: "Peter Kamau",
    note: "Eastlands Lettings",
    status: "approved",
  },
];
