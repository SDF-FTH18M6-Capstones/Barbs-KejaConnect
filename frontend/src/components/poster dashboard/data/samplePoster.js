import { mockListings } from "../../../data/mockListings";

export const SAMPLE_POSTER = {
  id: 11,
  full_name: "Wanjiku Mwangi",
  role: "manager",
  approval_status: "approved",
  company_name: "Greenleaf Property Managers",
};

// The sample poster's own listings
export const SAMPLE_MY_LISTINGS = mockListings.filter(
  (l) => l.poster.id === SAMPLE_POSTER.id,
);

// Inquiries tenants sent about those listings
export const SAMPLE_RECEIVED = [
  {
    id: 1,
    tenant_name: "Faith Njeri",
    tenant_phone: "+254 710 445 566",
    message:
      "Hello, is this unit still available? I would like to view it this weekend.",
    is_read: false,
    created_at: "2026-11-13T05:00:00Z",
    property_id: 1,
  },
  {
    id: 2,
    tenant_name: "Collins Ouma",
    tenant_phone: "+254 720 998 877",
    message: "Is parking included in the rent?",
    is_read: false,
    created_at: "2026-11-12T07:00:00Z",
    property_id: 10,
  },
  {
    id: 3,
    tenant_name: "Ian Kiplagat",
    tenant_phone: "+254 701 778 899",
    message: "Good morning. Are pets allowed in this building?",
    is_read: true,
    created_at: "2026-11-07T10:00:00Z",
    property_id: 4,
  },
].map(({ property_id, ...q }) => {
  const l = mockListings.find((x) => x.id === property_id);
  return {
    ...q,
    property: {
      id: l.id,
      title: l.title,
      building_name: l.building_name,
      area: l.area,
    },
  };
});

// The 4 dashboard numbers, worked out from the data above
export const SAMPLE_SUMMARY = {
  available: SAMPLE_MY_LISTINGS.filter((l) => l.status === "available").length,
  taken: SAMPLE_MY_LISTINGS.filter((l) => l.status === "taken").length,
  inquiries_total: SAMPLE_RECEIVED.length,
  inquiries_unread: SAMPLE_RECEIVED.filter((q) => !q.is_read).length,
};
