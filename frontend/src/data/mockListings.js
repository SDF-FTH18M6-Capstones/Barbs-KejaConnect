const poster = (id, full_name, is_verified = true) => ({ id, full_name, is_verified });

export const mockListings = [
  { id: 1, title: "2 Bedroom Apartment", property_type: "two_bedroom", price_monthly: 95000, bedrooms: 2, bathrooms: 2, area: "Kilimani", building_name: "Jabavu Court", status: "available", cover_image_url: null, poster: poster(11, "Wanjiku Mwangi"), created_at: "2026-11-09T09:30:00Z" },
  { id: 2, title: "Furnished 1 Bedroom Apartment", property_type: "one_bedroom", price_monthly: 85000, bedrooms: 1, bathrooms: 1, area: "Westlands", building_name: "Rhapta Square", status: "available", cover_image_url: null, poster: poster(12, "Brian Otieno"), created_at: "2026-11-08T14:10:00Z" },
  { id: 3, title: "Bedsitter", property_type: "bedsitter", price_monthly: 12000, bedrooms: 0, bathrooms: 1, area: "Roysambu", building_name: "TRM Drive Apartments", status: "available", cover_image_url: null, poster: poster(13, "Amina Hassan"), created_at: "2026-11-07T08:00:00Z" },
  { id: 4, title: "3 Bedroom Apartment", property_type: "three_bedroom", price_monthly: 140000, bedrooms: 3, bathrooms: 3, area: "Kileleshwa", building_name: "Mandera Gardens", status: "available", cover_image_url: null, poster: poster(11, "Wanjiku Mwangi"), created_at: "2026-11-06T16:45:00Z" },
  { id: 5, title: "2 Bedroom Apartment", property_type: "two_bedroom", price_monthly: 38000, bedrooms: 2, bathrooms: 1, area: "South B", building_name: "Mukoma Estate", status: "available", cover_image_url: null, poster: poster(14, "Peter Kamau"), created_at: "2026-11-04T11:20:00Z" },
  { id: 6, title: "1 Bedroom Apartment", property_type: "one_bedroom", price_monthly: 28000, bedrooms: 1, bathrooms: 1, area: "Ruaka", building_name: "Ndenderu Road Apartments", status: "available", cover_image_url: null, poster: poster(15, "Grace Njeri"), created_at: "2026-11-03T10:05:00Z" },
  { id: 7, title: "Maisonette", property_type: "house", price_monthly: 70000, bedrooms: 4, bathrooms: 3, area: "Syokimau", building_name: "Katani Road Maisonettes", status: "available", cover_image_url: null, poster: poster(12, "Brian Otieno"), created_at: "2026-11-02T13:30:00Z" },
  { id: 8, title: "Bungalow", property_type: "house", price_monthly: 85000, bedrooms: 3, bathrooms: 2, area: "Lang’ata", building_name: "Otiende Ridge", status: "available", cover_image_url: null, poster: poster(16, "Daniel Kiprop"), created_at: "2026-11-01T09:00:00Z" },
  { id: 9, title: "2 Bedroom Apartment", property_type: "two_bedroom", price_monthly: 23000, bedrooms: 2, bathrooms: 1, area: "Rongai", building_name: "Maasai Lodge Court", status: "available", cover_image_url: null, poster: poster(17, "Joyce Achieng", false), created_at: "2026-10-30T15:15:00Z" },
  { id: 10, title: "4 Bedroom House", property_type: "house", price_monthly: 350000, bedrooms: 4, bathrooms: 5, area: "Karen", building_name: "Bogani Road Homes", status: "available", cover_image_url: null, poster: poster(11, "Wanjiku Mwangi"), created_at: "2026-10-28T12:00:00Z" },
  { id: 11, title: "1 Bedroom Apartment", property_type: "one_bedroom", price_monthly: 13000, bedrooms: 1, bathrooms: 1, area: "Kitengela", building_name: "Acacia Court", status: "available", cover_image_url: null, poster: poster(18, "Samuel Mutua"), created_at: "2026-10-26T07:40:00Z" },
  { id: 12, title: "Studio", property_type: "studio", price_monthly: 55000, bedrooms: 0, bathrooms: 1, area: "Kilimani", building_name: "Ole Dume Residences", status: "available", cover_image_url: null, poster: poster(12, "Brian Otieno"), created_at: "2026-10-24T18:25:00Z" },
];

export const mockAreas = [
   "Kilimani","Kileleshwa","Lavington","Westlands","Parklands","South B","South C",
  "Lang'ata","Karen","Ngong Road","Roysambu","Kasarani","Kahawa West","Ruaka","Rongai",
  "Syokimau","Kitengela","Embakasi","Donholm","Utawala",
];