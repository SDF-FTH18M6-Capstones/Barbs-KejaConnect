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

const POSTER_STEPS = (proof) => [
  {
    title: "Confirm your email",
    text: "Click the link we send you to activate the account.",
    state: "now",
  },
  { title: "Upload proof", text: proof, state: "next" },
  {
    title: "Admin review",
    text: "Usually within one working day. You get an email either way.",
    state: "next",
  },
  {
    title: "Start listing",
    text: "Post units with photos. Each unit can only be listed once.",
    state: "next",
  },
];

export const ROLES = {
  tenant: {
    label: "Tenant",
    hint: "Looking for a house",
    title: "Sign up to find a house",
    subtitle:
      "Browse is open to everyone. An account lets you contact posters about a listing.",
    consent: "I agree to the terms of use.",
    button: "Create tenant account",
    steps: [
      {
        title: "Confirm your email",
        text: "Click the link we send you. It expires in 24 hours.",
        state: "now",
      },
      {
        title: "Log in and search",
        text: "Filter by area, rent and property type.",
        state: "next",
      },
      {
        title: "Send an inquiry",
        text: "The poster gets your message by email and replies to you.",
        state: "next",
      },
    ],
    side: {
      type: "info",
      title: "Why KejaConnect",
      text: "Every poster has shown proof of ownership or management to our team, and each unit appears only once, so you won't chase the same house through five agents.",
    },
  },
  manager: {
    label: "Manager",
    hint: "I manage units for owners",
    title: "Sign up as a property manager",
    subtitle:
      "List units you manage on behalf of owners. We verify every manager before they can post.",
    consent:
      "I confirm I am authorised to list the units I post, and I agree to the listing rules.",
    button: "Create manager account",
    showCompany: true,
    areaLabel: "Main area you manage in",
    steps: POSTER_STEPS("Your national ID and a signed management agreement."),
    side: {
      type: "documents",
      title: "Have these ready",
      items: [
        "National ID (front and back, one file)",
        "Signed management agreement with the owner",
        "PDF, JPG or PNG, up to 5 MB each",
      ],
      note: "An unsigned or unclear agreement is the most common reason for rejection.",
    },
  },
  owner: {
    label: "Owner",
    hint: "I own the property",
    title: "Sign up as a property owner",
    subtitle:
      "List your own units directly to tenants. We verify every owner before they can post.",
    consent:
      "I confirm I own the units I post, and I agree to the listing rules.",
    button: "Create owner account",
    areaLabel: "Where is your property?",
    areaHint: "You can list units in other areas later.",
    steps: POSTER_STEPS(
      "Your national ID and the title deed for the property.",
    ),
    side: {
      type: "documents",
      title: "Have these ready",
      items: [
        "National ID (front and back, one file)",
        "Title deed for the property",
        "PDF, JPG or PNG, up to 5 MB each",
      ],
      note: "The name on the title deed should match your ID.",
    },
  },
};
