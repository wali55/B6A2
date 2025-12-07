### Vehicle Rental System
This is a backend application where customer can rent vehicles. This include authentication, authorization and role based access control. Customer can book a vehicle, cancel booking, see all the vehicle. Admin has all the controls create, delete, edit vehicles, users etc.

---

Live Site: https://vehicle-management-system-puce.vercel.app/

---

## Features
- Admin create vehicles
- Customer/Admin can book vehicles
- Customer can cancel booking
- If Customer has no active booking admin can delete him/her.
- If a vehicle does not have active booking admin can delete it.
- There is JWT token based authentication and authorization system.

---

## Technology Stack
- Node.js
- Express.js
- TypeScript
- JWT
- PostgreSQL

---

## Setup & Usage Instructions
1. Run this command to clone the repo.
```
git clone https://github.com/wali55/B6A2
```
2. Run this command to install dependencies
```
npm i
```
3. Check out the src/config/index.ts file and give the postgreSQL connection string and jwt secret key and port before running the project locally.

4. Run this command to run the server locally
```
npm run dev
```

5. Run this command to build the project
```
npm run build
```