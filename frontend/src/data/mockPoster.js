import { mockListings } from "./mockListings";

export const unitFor = (listing) => listing.unit_number ?? `B${listing.id}`;

export const mockMyListings = mockListings.map((l) =>
  l.id === 4 ? { ...l, status: "taken" } : { ...l },
);

const tenant = (id, full_name, email, phone) => ({
  id,
  full_name,
  email,
  phone,
});

export const mockReceivedInquiries = [
  {
    id: 101,
    property_id: 1,
    status: "new",
    created_at: "2026-11-15T07:20:00Z",
    message:
      "Hello, is this unit still available? I would like to view it this weekend.",
    tenant: tenant(31, "Faith Njeri", "faith.njeri@example.com", "0710445566"),
  },
  {
    id: 102,
    property_id: 10,
    status: "new",
    created_at: "2026-11-14T12:05:00Z",
    message:
      "Is parking included in the rent, and is there a backup generator?",
    tenant: tenant(
      32,
      "Collins Ouma",
      "collins.ouma@example.com",
      "0720998877",
    ),
  },
  {
    id: 103,
    property_id: 4,
    status: "responded",
    created_at: "2026-11-10T09:40:00Z",
    message: "Good morning. Are pets allowed in this building?",
    tenant: tenant(
      33,
      "Ian Kiplagat",
      "ian.kiplagat@example.com",
      "0701778899",
    ),
  },
  {
    id: 104,
    property_id: 1,
    status: "closed",
    created_at: "2026-11-02T16:15:00Z",
    message: "Can I pay the deposit in two parts?",
    tenant: tenant(
      34,
      "Mercy Wambui",
      "mercy.wambui@example.com",
      "0733221100",
    ),
  },
  {
    id: 105,
    property_id: 3,
    status: "new",
    created_at: "2026-11-13T18:30:00Z",
    message: "Hi, is water included in the rent for this bedsitter?",
    tenant: tenant(
      35,
      "Kevin Otieno",
      "kevin.otieno@example.com",
      "0711002200",
    ),
  },
];

// Uploaded documents per poster id (the pending manager has one waiting)
export const mockDocuments = {
  19: [
    {
      id: 501,
      doc_type: "national_id",
      file_url: null,
      status: "pending",
      rejection_reason: null,
      created_at: "2026-11-14T08:00:00Z",
      reviewed_at: null,
    },
  ],
  11: [
    {
      id: 502,
      doc_type: "national_id",
      file_url: null,
      status: "approved",
      rejection_reason: null,
      created_at: "2026-10-01T08:00:00Z",
      reviewed_at: "2026-10-02T10:00:00Z",
    },
    {
      id: 503,
      doc_type: "management_agreement",
      file_url: null,
      status: "approved",
      rejection_reason: null,
      created_at: "2026-10-01T08:05:00Z",
      reviewed_at: "2026-10-02T10:00:00Z",
    },
  ],
};
