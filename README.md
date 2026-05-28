# GharSeRaddi

GharSeRaddi is a full-stack scrap collection platform built to simplify doorstep waste pickup and make recycling more accessible and organized. The platform allows users to request pickups, explore scrap categories, and manage scrap collection workflows through a clean and responsive interface. In a world with everything online, this is a facility to be used on a very daily basis.

## Features

- Doorstep scrap pickup request system
- Multiple scrap categories (Paper, Plastic, Metal, E-waste)
- Responsive and user-friendly UI
- Search and filtering functionality
- English / Hindi language toggle
- Contact and pickup request forms
- REST API based backend integration
- Role-based workflow structure (User / Admin)
- JWT-based authentication
- Admin dashboard for managing pickup requests and pricing
- User dashboard with real-time pickup status tracking
- Live scrap rate calculator with per-category earnings estimate

## Tech Stack

### Frontend
- React.js
- JavaScript
- CSS (Custom Design System)

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Other Tools
- JWT Authentication
- REST APIs
- Axios
- bcryptjs
- Mongoose ODM

## Project Structure

```
GharSeRaddi/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Navbar, Footer
│   │   ├── pages/           # Home, Login, Register, Prices, BookPickup, Dashboard, AdminPanel
│   │   ├── context/         # AuthContext (global user state)
│   │   ├── utils/           # Axios API helper
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── models/              # User, Pickup, ScrapPrice (Mongoose schemas)
│   ├── routes/              # auth, pickups, prices, admin
│   ├── middleware/          # JWT auth middleware
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Project Goal

The goal of this project is to create a simple and efficient digital solution for household scrap management while promoting organized recycling and waste collection practices.

## Future Improvements

- Pickup scheduling system with calendar view
- Collector-side dashboard
- Live pickup tracking
- Email and SMS notification support
- AI-based waste classification from photo
- Analytics dashboard for scrap collection insights
- UPI / payment integration
- PWA support for mobile users

## Screenshots

<p align="center">
  <img src="Screenshots/1.png" width="30%">
  <img src="Screenshots/2.png" width="30%">
  <img src="Screenshots/3.png" width="30%">
</p>

## Run Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Backend
```bash
git clone https://github.com/pratyaksha-projects/GharSeRaddi.git
cd GharSeRaddi/backend
npm install
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### Frontend
```bash
cd ../frontend
npm install
npm start
```

### Seed Scrap Prices (first time only)
After backend is running, call this once:
```
POST http://localhost:5000/api/prices/seed
```
Or go to Admin Panel → Prices tab → click **Seed Default Prices**

### Create Admin User
In MongoDB shell:
```js
db.users.updateOne({ email: "gharseraddi@email.com" }, { $set: { role: "admin" } })
```

## Author

**Pratyaksha Saini** — [GitHub](https://github.com/pratyaksha-projects)

## License

MIT
