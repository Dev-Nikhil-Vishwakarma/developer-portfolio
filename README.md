# Developer Portfolio

Premium white React + TypeScript portfolio with GSAP animations and an Express + Resend contact backend.

## Stack
- React + TypeScript + Vite
- GSAP
- Express + TypeScript
- Resend for contact email delivery

## Run

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set these values in `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=lapyslapy04@gmail.com
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
```

For production, use a verified domain in Resend and replace `CONTACT_FROM_EMAIL` with an address on that domain.

## Contact flow
Browser -> Express `/api/contact` -> Resend -> `lapyslapy04@gmail.com`.
The Resend API key stays only on the backend.
