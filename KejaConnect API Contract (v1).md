# KejaConnect API Contract (v1)

The single source of truth for frontend and backend. Frontend builds against mocks that copy these shapes, and backend returns exactly these fields. Change this document only through a PR, tag both sides, and announce the change at standup.

## 1. Conventions

- **Base URL:** `/api/v1` (local: `http://localhost:5000/api/v1`)
- **Auth:** header `Authorization: Bearer <access_token>`. One access token, 24h expiry, no refresh token in the MVP. On any 401 the frontend clears the token and redirects to `/login`.
- **Format:** JSON for requests and responses, except file uploads (`multipart/form-data`).
- **Dates:** ISO 8601 in UTC, for example `2026-11-12T09:30:00Z`. The frontend turns them into human-readable text.
- **Money:** integers in KES, for example `price_monthly: 35000`.
- **IDs:** integers.
- **Roles:** `tenant`, `manager`, `owner`, `admin`. A **poster** is a manager or owner. An **approved poster** is a poster whose `approval_status` is `approved`.
- **Extra fields:** the backend may add fields, but renaming or removing one needs a PR to this doc.

### Error format

Every error uses this shape. `details` appears only for validation errors and a few 409s.

```
{ error: Human readable message, code: MACHINE_CODE, details: { field: [messages] } }
```

| Status | Codes |
| --- | --- |
| 400 | `VALIDATION_ERROR`, `INVALID_TOKEN`, `INVALID_FILE` |
| 401 | `UNAUTHENTICATED`, `INVALID_CREDENTIALS` |
| 403 | `FORBIDDEN`, `EMAIL_NOT_VERIFIED`, `ACCOUNT_NOT_APPROVED` |
| 404 | `NOT_FOUND` |
| 409 | `EMAIL_TAKEN`, `DUPLICATE_LISTING` |
| 500 | `SERVER_ERROR` |

The frontend branches on `code`, never on the message text.

### Pagination

Every list endpoint (except `GET /areas`) accepts `page` (default 1) and `per_page` (default 10, max 50) and returns:

```
{ items: [...], page: 1, per_page: 10, total: 134, pages: 14 }
```

An out-of-range page returns an empty `items` array, not an error.

## 2. Shared objects

**Enums**

- `property_type`: `bedsitter`, `studio`, `one_bedroom`, `two_bedroom`, `three_bedroom`, `house`, `commercial`
- `listing status`: `available`, `taken`, `removed`
- `approval_status`: `not_required`, `pending`, `approved`, `rejected`
- `doc_type`: `national_id`, `title_deed`, `management_agreement`

**User**

```
{ id, full_name, email, phone, role, is_email_verified, approval_status, created_at }
```

**PropertySummary** (used in lists)

```
{ id, title, property_type, price_monthly, bedrooms, bathrooms, area, building_name,
  status, cover_image_url, poster: { id, full_name, is_verified }, created_at }
```

**PropertyDetail** (PropertySummary plus)

```
{ description, county, unit_number, lr_number, images: PropertyImage[],
  poster: { id, full_name, role, is_verified }, updated_at }
```

Poster email and phone are never exposed publicly. Tenants contact posters through inquiries.

**PropertyImage**

```
{ id, url, is_cover, position }
```

**VerificationDocument**

```
{ id, doc_type, file_url, status, rejection_reason, created_at, reviewed_at }
```

The admin version also includes `user: { id, full_name, email, role }`.

**Inquiry**

```
{ id, message, status, created_at, property: { id, title },
  tenant: { id, full_name, email, phone } }
```

The `tenant` field is included in the poster's received list. The tenant's sent list omits it.

## 3. Endpoints

### Auth (Must)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /auth/register` | Public | `{ full_name, email, phone, password, role }` where role is `tenant`, `manager` or `owner` | 201 `{ message, user }` | 400 `VALIDATION_ERROR`, 409 `EMAIL_TAKEN` |
| `POST /auth/verify-email` | Public | `{ token }` | 200 `{ message }` | 400 `INVALID_TOKEN` (expired, used or unknown) |
| `POST /auth/resend-verification` | Public | `{ email }` | 200 `{ message }` (same message whether or not the account exists) | 400 `VALIDATION_ERROR` |
| `POST /auth/login` | Public | `{ email, password }` | 200 `{ access_token, user }` | 401 `INVALID_CREDENTIALS`, 403 `EMAIL_NOT_VERIFIED` |
| `GET /auth/me` | Any logged-in user | none | 200 `{ user }` | 401 `UNAUTHENTICATED` |

**Rules**

- Password: at least 8 characters, with at least one letter and one number.
- Phone: Kenyan format, `07XXXXXXXX` or `+2547XXXXXXXX`.
- Registering as `admin` is rejected with 400. Admins are created only by the seed script.
- The verification email links to the frontend at `/verify-email?token=...`. Tokens expire after 24 hours.
- In dev and test, emails are printed to the console instead of sent.

### Poster verification (Must)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /verification/documents` | Poster | multipart: `doc_type`, `file` (jpg, png or pdf, max 5 MB) | 201 `{ document }` | 400 `INVALID_FILE`, 403 `FORBIDDEN` |
| `GET /verification/documents` | Poster | pagination | 200 paginated `VerificationDocument` | 403 |
| `GET /admin/verifications` | Admin | `status` (default `pending`), pagination | 200 paginated admin `VerificationDocument` | 403 |
| `PATCH /admin/verifications/:id` | Admin | `{ action, reason }` where action is `approve` or `reject`, and reason is required for reject | 200 `{ document }` | 400 `VALIDATION_ERROR`, 404 |

**Rules**

- A new upload sets the user's `approval_status` to `pending`.
- Approve sets the user to `approved`. Reject sets the user to `rejected`. In both cases the user gets an email.
- A rejected poster can upload again, which sets them back to `pending`.

### Listings (Must)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET /listings` | Public | `area`, `property_type`, `min_price`, `max_price`, pagination | 200 paginated `PropertySummary` (only `available`, newest first) | 400 `VALIDATION_ERROR` |
| `GET /listings/:id` | Public | none | 200 `{ listing }` as `PropertyDetail` | 404 |
| `GET /listings/mine` | Poster | `status` (optional), pagination | 200 paginated `PropertySummary` (all statuses except `removed`) | 403 |
| `POST /listings` | Approved poster | `{ title, description, property_type, price_monthly, bedrooms, bathrooms, area, building_name, unit_number, lr_number, county }` (`lr_number` and `county` optional, county defaults to Nairobi) | 201 `{ listing }` | 400, 403 `ACCOUNT_NOT_APPROVED`, 409 `DUPLICATE_LISTING` |
| `PUT /listings/:id` | Listing owner | same body as create | 200 `{ listing }` | 400, 403, 404, 409 `DUPLICATE_LISTING` |
| `PATCH /listings/:id/status` | Listing owner | `{ status }` | 200 `{ listing }` | 400, 403, 404 |
| `GET /areas` | Public | none | 200 `{ items: [area names] }` (not paginated, static list for the dropdown) | none |

**Rules**

- `GET /listings/:id` returns 404 for `removed` listings. `taken` listings are still viewable, marked as taken.
- `area` must be one of the values from `GET /areas`. `price_monthly` must be greater than 0.
- **Duplicate prevention:** the backend builds a normalized key from area, building name and unit number. On a match it returns 409 with:

```
{ error: This unit is already listed, code: DUPLICATE_LISTING,
  details: { existing_listing_id, poster_name } }
```

- Editing the area, building name or unit number re-runs the duplicate check.

### Listing images (Must)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /listings/:id/images` | Listing owner | multipart: `images` (one or more jpg, png or webp, max 5 MB each, max 8 per listing) | 201 `{ images }` (all images of the listing) | 400 `INVALID_FILE`, 403, 404 |
| `DELETE /listings/:id/images/:image_id` | Listing owner | none | 204 | 403, 404 |
| `PATCH /listings/:id/images/:image_id/cover` | Listing owner | none | 200 `{ images }` | 403, 404 |

**Rules**

- The backend resizes images before uploading to Cloudinary.
- The first image uploaded becomes the cover automatically.
- Deleting an image also deletes it from Cloudinary.

### Inquiries (Must)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /listings/:id/inquiries` | Tenant | `{ message }` (10 to 1000 characters) | 201 `{ inquiry }` | 400, 403 `FORBIDDEN`, 404 |
| `GET /inquiries/received` | Poster | `listing_id` (optional), pagination | 200 paginated `Inquiry` | 403 |
| `GET /inquiries/sent` | Tenant | pagination | 200 paginated `Inquiry` | 403 |

**Rules**

- Creating an inquiry emails the poster with the tenant's name, contact details and message.
- Inquiries are only allowed on `available` listings.

### Admin stats (Should)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET /admin/stats` | Admin | none | 200 below | 403 |

```
{ users: { tenant, manager, owner }, listings: { available, taken, removed },
  pending_verifications, open_reports }
```

### Saved listings (Could)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /listings/:id/save` | Tenant | none | 201 `{ saved: true }` (saving twice is fine and returns 200) | 403, 404 |
| `DELETE /listings/:id/save` | Tenant | none | 204 | 403, 404 |
| `GET /saved` | Tenant | pagination | 200 paginated `PropertySummary` | 403 |

### Reports (Could)

| Endpoint | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /listings/:id/report` | Any logged-in user | `{ reason }` (10 to 500 characters) | 201 `{ message }` | 400, 404 |
| `GET /admin/reports` | Admin | `status` (default `open`), pagination | 200 paginated report | 403 |
| `PATCH /admin/reports/:id` | Admin | `{ status }` where status is `resolved` or `dismissed` | 200 `{ report }` | 400, 404 |

A report object is `{ id, reason, status, created_at, property: { id, title }, reporter: { id, full_name } }`.

## 4. Permission matrix

| Action | Visitor | Tenant | Pending or rejected poster | Approved poster | Admin |
| --- | --- | --- | --- | --- | --- |
| Browse listings and details | Yes | Yes | Yes | Yes | Yes |
| Send inquiry | No | Yes | No | No | No |
| Upload verification documents | No | No | Yes | Yes | No |
| Create listing | No | No | No | Yes | No |
| Edit or remove own listing | No | No | No | Yes | No |
| View received inquiries | No | No | Yes | Yes | No |
| Review verifications and reports | No | No | No | No | Yes |

Every write endpoint needs a test that the wrong role or wrong owner gets a 403.

## 5. Working with this contract

- **Frontend:** keep mock data in one folder, shaped exactly like the objects above. Switching to the real API should be a flag change.
- **Backend:** return exactly the documented fields and status codes. If something needs to change, open a PR to this doc first.
- **Verifying:** keep a Postman or Thunder Client collection in the repo and update it with each endpoint. Swagger can be generated from this contract later.
- **Open questions to settle on day 1:** password rules, the allowed `areas` list, image size limits, and token expiry.
