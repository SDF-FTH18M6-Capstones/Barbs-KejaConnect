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
    documentFiles: [
      {
        id: 1,
        name: "National ID",
        fileName: "kevin_national_id.pdf",
        fileType: "PDF",
        url: null,
      },
      {
        id: 2,
        name: "Management Agreement",
        fileName: "management_agreement.pdf",
        fileType: "PDF",
        url: null,
      },
    ],
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
    documentFiles: [
      {
        id: 1,
        name: "National ID",
        fileName: "lucy_national_id.pdf",
        fileType: "PDF",
        url: null,
      },
      {
        id: 2,
        name: "Title Deed",
        fileName: "title_deed.pdf",
        fileType: "PDF",
        url: null,
      },
    ],
    submittedAt: "Yesterday",
    status: "pending",
  },
];

// Approved applications
export const mockApprovedPosters = [
  {
    id: 5,
    name: "Peter Kamau",
    email: "peter.kamau@kejaconnect.test",
    role: "Owner",
    company: "",
    documents: ["National ID", "Title Deed"],
    submittedAt: "3 days ago",
    status: "approved",
  },
  {
    id: 6,
    name: "Grace Wanjiru",
    email: "grace.wanjiru@kejaconnect.test",
    role: "Manager",
    company: "Grace Properties",
    documents: ["National ID", "Management Agreement"],
    submittedAt: "5 days ago",
    status: "approved",
  },
  {
    id: 7,
    name: "James Mwangi",
    email: "james.mwangi@kejaconnect.test",
    role: "Owner",
    company: "",
    documents: ["National ID", "Title Deed"],
    submittedAt: "1 week ago",
    status: "approved",
  },
  {
    id: 8,
    name: "Mary Atieno",
    email: "mary.atieno@kejaconnect.test",
    role: "Manager",
    company: "Atieno Rentals",
    documents: ["National ID", "Management Agreement"],
    submittedAt: "1 week ago",
    status: "approved",
  },
  {
    id: 9,
    name: "Brian Otieno",
    email: "brian.otieno@kejaconnect.test",
    role: "Owner",
    company: "",
    documents: ["National ID", "Title Deed"],
    submittedAt: "2 weeks ago",
    status: "approved",
  },
  {
    id: 10,
    name: "Sarah Njeri",
    email: "sarah.njeri@kejaconnect.test",
    role: "Manager",
    company: "Njeri Homes",
    documents: ["National ID", "Management Agreement"],
    submittedAt: "2 weeks ago",
    status: "approved",
  },
];

// Rejected applications
export const mockRejectedPosters = [
  {
    id: 3,
    name: "Dennis Kiprop",
    email: "dennis.kiprop@kejaconnect.test",
    role: "Manager",
    company: "Kiprop Agencies",
    documents: ["National ID", "Management Agreement"],
    submittedAt: "4 days ago",
    status: "rejected",
    rejectionReason: "Unsigned management agreement.",
  },
];

// Combined applications for the approval table
export const mockAdminApplications = [
  ...mockPendingApprovals,
  ...mockApprovedPosters,
  ...mockRejectedPosters,
];

// Recent decisions displayed on the dashboard
export const mockRecentDecisions = [
  {
    id: 3,
    name: "Dennis Kiprop",
    note: "Unsigned management agreement",
    status: "rejected",
  },
  {
    id: 5,
    name: "Peter Kamau",
    note: "Eastlands Lettings",
    status: "approved",
  },
];
