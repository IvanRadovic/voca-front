# Voca — Frontend (React + Vite + TypeScript + Tailwind)

Single-page app for **Voca**, a platform connecting young people (15–30) with
opportunities published by NGOs. Talks to the `voca-back` Laravel API.

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS (with class-based dark mode)
- React Router DOM
- Axios API client
- Context API for auth, language (EN/CNR), theme and modals

## Requirements

- Node 18+ (developed on Node 22)
- A running `voca-back` API (see that repo)

## 1. Install & configure

```bash
npm install
cp .env.example .env
```

`.env`:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

## 2. Run

```bash
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build
```

## Demo accounts

With the backend seeded, log in (password **`password`** for all):

- **Youth**: `ana@voca.test` — personalized feed, applications, wishlist, reviews
- **NGO**: `nvo@voca.test` — dashboard, create/edit calls, manage applicants

## Project structure

```
src/
├─ components/        # Navbar, Footer, CallCard, AuthModal, CallForm, ApplicantsPanel…
│  └─ ui/             # Modal, Spinner, Avatar primitives
├─ context/           # Auth, Language (EN/CNR), Theme (dark mode), Modal
├─ i18n/              # translation dictionaries
├─ lib/               # axios client, constants, formatters
├─ pages/             # Landing, Browse, CallDetails, Dashboard, Profile, NotFound
├─ types/             # shared API types
└─ App.tsx            # routes + providers
```

## Features

- **Landing**: hero + CTAs, platform stats, category quick-filters, latest &
  recommended calls, testimonials.
- **Browse**: grid with type/category/location filters, search, pagination.
- **Call details**: full info, organizer, apply (1-click), wishlist, reviews,
  similar calls.
- **Youth profile**: edit profile + interests, applications with statuses,
  wishlist, and reviews (rate completed events).
- **NGO dashboard**: stats, create/edit/delete calls (with image upload &
  preview), manage applicants (accept/reject/complete), email all applicants,
  editable welcome message, recent feedback.
- **EN / CNR** language toggle and **dark mode** in the navbar.

Auth uses a Sanctum bearer token stored in `localStorage` and attached to every
request via an Axios interceptor.
