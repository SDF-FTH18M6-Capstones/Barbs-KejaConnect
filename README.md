# KejaConnect

**Find a house in Nairobi, listed once, by someone verified.**

KejaConnect is a house-hunting platform built around trust. Tenants browse and filter listings, then contact the poster through an in-app inquiry. Posters (property managers and owners) upload documents that an admin approves before they can list, and the backend blocks a second listing for the same unit.

Built by Team Barbs as a Moringa School capstone project.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API](#api)
- [Frontend](#frontend)
- [Backend](#backend)
- [Testing](#testing)
- [Team workflow](#team-workflow)
- [Team](#team)
- [Troubleshooting](#troubleshooting)

---

## Features

**Tenants**
- Browse listings with filters (area, property type, monthly rent) and pagination
- Listing detail page with a photo gallery, poster card and Verified badge
- Send an inquiry to the poster (10 to 1,000 characters)
- Sign up, verify email, log in, and see their own inquiries

**Posters (managers and owners)**
- Register and upload verification documents (national ID, title deed or management agreement)
- Once approved: create, edit and remove listings, and upload listing photos
- See inquiries received on their listings

**Admins**
- Review and approve or reject poster verification documents
- Review reports and see platform stats

**Platform rules**
- Only approved posters can list
- Only the owner of a listing can edit or remove it
- Duplicate units are blocked (a key built from area, building name and unit number)
- Poster phone numbers and emails are never shown publicly
- Passwords are stored as bcrypt hashes, and email verification links expire after 24 hours

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, React Router |
| Backend | Python, Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Marshmallow |
| Database | PostgreSQL |
| Auth | JWT (Flask-JWT-Extended), Flask-Bcrypt |
| Email and images | SendGrid (verification emails), Cloudinary (listing photos) |
| Testing | pytest, pytest-cov |

---

## Project structure

```
Barbs-KejaConnect/
├── KejaConnect API Contract (v1).md   # the single source of truth for the API
├── backend/
│   ├── app/
│   │   ├── __init__.py                # create_app() application factory
│   │   ├── api/                       # blueprint, routes and error handlers
│   │   │   └── resources/             # one Flask-RESTful resource per endpoint
│   │   ├── services/                  # business rules (auth, listings, inquiries, ...)
│   │   ├── repository/                # all database queries
│   │   ├── models/                    # SQLAlchemy models
│   │   ├── schemas/                   # Marshmallow validation and serialization
│   │   ├── config/                    # Flask config, db, bcrypt, SendGrid client
│   │   ├── utils/                     # email templates, constants
│   │   ├── exceptions.py              # custom errors mapped to HTTP responses
│   │   └── seed.py                    # sample data script
│   ├── migrations/                    # Alembic migrations
│   ├── tests/                         # pytest suite
│   ├── Pipfile
│   ├── pytest.ini
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/                       # fetch layer, with a mock switch
    │   ├── components/                # shared and page-level components
    │   ├── pages/                     # one folder or file per page
    │   ├── data/                      # mock data shaped like the API contract
    │   ├── utils/                     # formatting, labels, hooks
    │   ├── paths.js                   # link paths used in components
    │   ├── routes.jsx                 # the router
    │   └── theme.css                  # design tokens (colours, fonts)
    └── package.json
```

The backend is layered: **resource, then service, then repository**. Route handlers stay thin, rules such as ownership and duplicate checks live in services, and only repositories talk to the database.

---

## Getting started

You need **Git**, **Node.js** (18 or newer), **Python** (the `Pipfile` pins 3.14; the test suite also runs on 3.12), **pipenv**, and a local **PostgreSQL**.

### 1. Clone

```bash
git clone https://github.com/SDF-FTH18M6-Capstones/Barbs-KejaConnect.git
cd Barbs-KejaConnect
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # then fill in the values (see Environment variables)
pipenv install --dev
pipenv shell
```

Create the database and apply the migrations:

```bash
psql -U postgres -c "CREATE DATABASE kejaconnect;"
flask db upgrade
```

Start the API (it listens on http://localhost:5000):

```bash
flask run
```

Optional sample data: see the header of `app/seed.py` for how to run it.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_USE_MOCKS=false
```

Then:

```bash
npm run dev
```

Open http://localhost:5173.

**No backend yet?** Set `VITE_USE_MOCKS=true` and the pages run on mock data that has the same shapes as the API. Restart `npm run dev` after changing `.env`, because Vite only reads it on startup.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Signs JWTs and sessions. Use a long random value (32+ bytes) |
| `DATABASE_URL` | PostgreSQL connection, for example `postgresql+psycopg://postgres:<password>@127.0.0.1:5432/kejaconnect` |
| `APP_SETTINGS` | Which config class to load. Set in `.flaskenv`, so check that file |
| `SENDGRID_API_KEY` | SendGrid key for verification emails |
| `FROM_EMAIL` | Sender address for emails |
| `BACKEND_URL` | Base URL used in links inside emails |

Cloudinary credentials are also needed for photo uploads. Copy the exact names from `.env.example`.

> **Never commit `.env`.** It holds your database password and API keys. Only `.env.example` belongs in the repository. If a password contains `@`, `#`, `/`, `:` or `%`, URL-encode it in `DATABASE_URL`.

### Frontend (`frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the API. Default `http://localhost:5000/api/v1` |
| `VITE_USE_MOCKS` | `true` runs the pages on mock data, `false` calls the real API |

---

## API

The full specification is in [`KejaConnect API Contract (v1).md`](./KejaConnect%20API%20Contract%20(v1).md). **The contract is the source of truth:** the frontend builds against mocks that copy it, and the backend returns exactly what it documents. Change it only through a pull request, tag both sides, and announce it at standup.

**Conventions**
- Base URL: `/api/v1` (local: `http://localhost:5000/api/v1`)
- Auth: `Authorization: Bearer <access_token>`, one token with a 24-hour expiry
- Dates are ISO 8601 in UTC, money is an integer in KES, ids are integers
- Roles: `tenant`, `manager`, `owner`, `admin`. An approved poster is a manager or owner with `approval_status = approved`
- Lists accept `page` and `per_page` (default 10, max 50) and return `{ items, page, per_page, total, pages }`
- Every error uses one shape, and the frontend branches on `code`, never on the message:

```json
{ "error": "Human readable message", "code": "MACHINE_CODE", "details": { "field": ["messages"] } }
```

| Status | Codes |
|---|---|
| 400 | `VALIDATION_ERROR`, `INVALID_TOKEN`, `INVALID_FILE` |
| 401 | `UNAUTHENTICATED`, `INVALID_CREDENTIALS` |
| 403 | `FORBIDDEN`, `EMAIL_NOT_VERIFIED`, `ACCOUNT_NOT_APPROVED` |
| 404 | `NOT_FOUND` |
| 409 | `EMAIL_TAKEN`, `DUPLICATE_LISTING` |
| 500 | `SERVER_ERROR` |

**Endpoints (summary)**

| Area | Endpoints | Access |
|---|---|---|
| Auth | register, verify email, resend verification, login, current user | public, then any logged-in user |
| Poster verification | upload and list own documents, admin list and approve or reject | poster, admin |
| Listings | list with filters, get one, mine, create, update, change status, areas | public, approved poster, owner |
| Listing images | upload (max 8), delete, set cover | listing owner |
| Inquiries | send, received, sent | tenant, poster |
| Admin | stats, reports | admin |
| Saved listings and reports | save, unsave, list saved, report a listing | tenant, any logged-in user |

Some paths in the running code differ from the contract (for example, sign-up is served at `/auth/signup` and the current user at `/me`). These differences are recorded as expected failures in the test suite, so run `pytest -rx` to list them.

---

## Frontend

- **Pages:** landing and browse, listing detail with inquiry form, sign up, login and email verification, My Inquiries, poster dashboard, admin dashboard and approval queue
- **Data layer:** `src/api/` holds one function per endpoint. With `VITE_USE_MOCKS=true` it serves `src/data/` through `mockApi.js`, with the same inputs and outputs as the real API. Pages never know which one they are using
- **Design tokens:** colours and fonts live in `src/theme.css` and are exposed to Tailwind in `src/index.css`. Use the named classes (`bg-brand`, `text-ink`, `border-line`) and never hard-code hex values
- **Palette:** deep green `#0E6B4E` as the brand colour, with Inter for text and Space Grotesk for headings
- **Errors:** every data-driven page has loading, empty and retry states, and API errors are handled by `code`

Scripts (from `frontend/`):

```bash
npm run dev       # development server on http://localhost:5173
npm run build     # production build
npm run lint      # ESLint
```

---

## Backend

- **Application factory:** `create_app()` in `app/__init__.py` loads the config, initialises the extensions, and registers the `/api/v1` blueprint
- **Auth:** JWT with the user id and role in the token. Protected routes check the role and the poster's approval status, and listing edits also check ownership
- **Errors:** custom exceptions in `app/exceptions.py` are turned into HTTP responses by `app/api/error_handlers.py`
- **Migrations:** schema changes go through Flask-Migrate:

```bash
flask db migrate -m "describe the change"   # then read the generated file
flask db upgrade
```

Autogenerated migrations can miss enums, defaults and constraints, so always review them before applying.

### Data model

| Table | Purpose |
|---|---|
| `users` | tenants, managers, owners and admins |
| `email_verification_tokens` | hashed, expiring verification links |
| `verification_documents` | ID, title deed or management agreement uploads |
| `properties` | the listings |
| `property_images` | photos, with one cover image |
| `inquiries` | a tenant's message about a unit |
| `saved_listings` | a tenant's shortlist |
| `reports` | a flagged listing |

---

## Testing

The backend has a pytest suite, written from the API contract and not from what the code happens to do.

```bash
cd backend
pipenv shell                       # or activate your virtual environment
python -m pytest -q -rx            # run everything and list the expected failures
```

At the time of writing: 28 tests pass and 16 are expected failures (see below).

**How the tests stay safe**
- They run on **in-memory SQLite** and refuse to start against any other database, so they can never touch your real data
- **SendGrid is faked** at the client class, so no email is ever sent, and the tests read the verification token from the fake mailbox
- **Network access is blocked** in every test, so any accidental outside call fails loudly
- Each test gets a fresh, empty database

**Expected failures (`xfail`)**
Where the code differs from the contract, the test says so with `@pytest.mark.xfail(strict=True, reason=...)`. The suite stays green, and `-rx` lists each gap with its reason. When someone fixes a gap, that test reports `XPASS(strict)`, which means "delete the marker."

**Coverage**

```bash
python -m pytest --cov=app --cov-report=term-missing
python -m pytest --cov=app --cov-report=html     # open htmlcov/index.html
```

A coverage file or `htmlcov/` should never be committed.

**Adding a test**
1. Write the assertion from the contract (status, response fields, who is allowed)
2. Use the `client`, `urls` and `mailbox` fixtures from `tests/conftest.py`, and the helpers in `tests/helpers.py` (`create_user`, `create_verified_user`, `login`)
3. Every write endpoint needs a test that the wrong role or the wrong owner gets a 403
4. If the code disagrees with the contract, do not change the test to match. Raise it with the owner of that code

---

## Team workflow

- Work is planned as user stories on the GitHub Projects board, and each task is a card
- One branch per piece of work, named by type: `feature/...`, `fix/...`, `test/...`, `chore/...`
- Always branch from an up-to-date `development`, and never reuse a branch after its pull request is merged
- Open a pull request into `development`, with a description of what changed, how to test it, and notes for reviewers. The scrum master reviews it
- Commit messages are short and typed: `feat:`, `fix:`, `test:`, `chore:`
- Merge `development` into your branch often. Lock files (`Pipfile.lock`, `package-lock.json`) conflict easily, so regenerate them instead of editing by hand
- Contract changes go through a pull request and are announced at standup

---

## Team

| Name | Focus |
|---|---|
| Cornelius | Scrum master, database tables, shared components, API endpoints |
| David | Sign-up page and poster dashboard routes |
| Fiona | Login and email verification, admin dashboard |
| Jeff | Landing, browse and listing detail pages, inquiry form, backend tests |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `python: command not found` | A virtual environment is not active. Run `pipenv shell`, or `source .venv/bin/activate` |
| `ModuleNotFoundError: No module named 'flask'` | You are using the system Python. Activate the environment, or use `pipenv run ...` |
| `password authentication failed for user "postgres"` | The password in `DATABASE_URL` is wrong. Fix `.env`, then **restart the shell**, because variables already loaded are not overwritten |
| `no pq wrapper available` or `libpq library not found` | The Postgres driver needs `libpq`. Install `libpq` (or the `psycopg[binary]` package) |
| Port 5432 refuses or authenticates against the wrong server | On WSL, `127.0.0.1:5432` may reach a Postgres installed on Windows. Check which one is listening |
| Frontend shows "Can't reach the server" | The backend is not running. Start it, or set `VITE_USE_MOCKS=true` |
| Pages ignore a `.env` change | Restart `npm run dev` |
| A blank page and "does not provide an export named ..." in the console | A file is out of date after a merge. Pull `development` and check the imports the message names |
| `<<<<<<<` in a file | An unresolved merge conflict was committed. Fix the file, keep both sides' routes, and delete only the marker lines |
| Tests fail with "No email was sent" | The email code moved and the fake no longer catches it. Check that `tests/conftest.py` patches `SendGridAPIClient.send` |

---

## License

Built for educational purposes as a Moringa School capstone project.