export const AREAS = [
  "Kilimani",
  "Kileleshwa",
  "Lavington",
  "Westlands",
  "Parklands",
  "South B",
  "South C",
  "Lang'ata",
  "Karen",
  "Ngong Road",
  "Roysambu",
  "Kasarani",
  "Kahawa West",
  "Ruaka",
  "Rongai",
  "Syokimau",
  "Kitengela",
  "Embakasi",
  "Donholm",
  "Utawala",
];

const POSTER_STEPS = [
  "Confirm your email",
  "Upload your proof document",
  "Wait for admin approval (about one working day)",
  "Start listing your units",
];

export const ROLES = {
  tenant: {
    label: "Tenant",
    title: "Sign up to find your ideal rental property",
    button: "Create tenant account",
    steps: [
      "Confirm your email",
      "Search for rental properties by area and budget",
      "Send an inquiry to the poster",
    ],
  },
  manager: {
    label: "Manager",
    title: "Sign in as a property manager",
    button: "Create manager account",
    showCompany: true,
    areaLabel: "Main area you manage in",
    steps: POSTER_STEPS,
    documents: ["National ID", "Signed management agreement"],
  },
  owner: {
    label: "Owner",
    title: "Sign up to list your rental property",
    button: "Create owner account",
    areaLabel: "Main area your property is located in",
    steps: POSTER_STEPS,
    documents: ["National ID", "Proof of ownership"],
  },
};
