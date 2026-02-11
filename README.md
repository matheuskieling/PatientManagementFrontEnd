# Fichario Digital — Frontend

The web frontend for Fichario Digital, a patient and financial management system for a doctor's clinic. Built with Angular 20 and Ant Design (ng-zorro-antd).

## Tech Stack

- **Framework:** Angular 20 (standalone components)
- **Language:** TypeScript 5.8 (strict mode)
- **UI Library:** ng-zorro-antd (Ant Design for Angular)
- **State Management:** Angular Signals
- **Styling:** SCSS + CSS custom properties, LESS for ng-zorro theming
- **Auth:** JWT stored in localStorage, HTTP interceptor for Bearer tokens (since it is a ONE user app, it was a decision to simplify architecture)
- **Input Masking:** ngx-mask (CPF, RG, phone)
- **PDF Export:** html2pdf.js

## Features

### Patient Records (Fichario)
- Paginated patient table with advanced filtering (name, CPF, RG, phone, gender, birth date, category, health plan)
- Create and edit patients with form validation and duplicate detection
- Auto-generated file numbers (consultation and ultrasound)
- Emergency contact management
- Health plan and category association
- Patient envelope/file printing via PDF export

### Financial Module (Financeiro)
- Income and expense tracking with daily closing summary
- Filter transactions by date range, doctor, health plan, or payment method (Card, Pix, Cash)
- Create, edit, and delete transactions
- Print-friendly transaction view

### Supporting Entities
- Doctor, health plan, and category management via dialogs
- Pre-delete impact verification

### Authentication
- Login and registration pages
- JWT-based auth with automatic 401 redirect
- HTTP interceptor attaches Bearer token to all API requests

## Project Structure

```
src/
├── app/
│   ├── pages/                  4 pages (Login, Register, Fichario, Financeiro)
│   ├── components/             20 feature & dialog components
│   ├── services/               7 HTTP services (auth, patient, payment, doctor, etc.)
│   ├── interfaces/             TypeScript models & DTOs
│   ├── app.routes.ts           Route definitions
│   ├── auth-interceptor.ts     JWT HTTP interceptor
│   └── app.config.ts           Angular DI configuration
├── enums/                      PaymentMethod enum
├── environments/               Dev & production API URLs
├── constants.ts                App-wide constants
├── styles.scss                 Global styles & design tokens
└── theme.less                  ng-zorro theme overrides
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### Install dependencies

```bash
npm install
```

### Environment configuration

The API URL is configured per environment:

| Environment | File | API URL |
|---|---|---|
| Development | `src/environments/environment.dev.ts` | `http://localhost:5000/api` |
| Production | `src/environments/environment.ts` | `https://fetaledigital.com.br/api` |

Make sure the [backend API](https://github.com/matheuskieling/PatientManagement) is running before starting the frontend.

### Run the dev server

```bash
ng serve
```

Open `http://localhost:4200`. The app reloads automatically on file changes.

### Build for production

```bash
ng build
```

Output goes to `dist/`.

### Run tests

```bash
ng test
```

Uses Karma + Jasmine.

# IMPORTANT NOTE
This is a real app and was authorized to be in a public repo by the *client*
