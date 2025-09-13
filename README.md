# PizzaHouse

A full-stack web application for managing a pizza restaurant ordering system with user authentication, menu management, order processing, and more.

## Project Structure

```
PizzaHouse/
├── PH Back end/     # Spring Boot backend (see [README](./PH%20Back%20end/README.md))
├── PH Front end/    # React + TypeScript frontend (see [README](./PH%20Front%20end/README.md))
```

## Technologies Used

**Backend:** Java 17+, Spring Boot 3, Spring Security, Spring Data JPA, MySQL, Maven, Lombok  
**Frontend:** React, TypeScript, Vite, React Router, SCSS, React Toastify

## Features

- User Authentication & Authorization (JWT)
- Role-based Access Control (Admin/Customer)
- Menu & Offer Management
- Order & Shopping Cart Processing
- User Profile & Previous Orders History
- Item-Offer Mapping
- File Uploads (images)
- Responsive UI
- API Documentation (Swagger)

## Quick Start

```bash
# Backend
cd "PH Back end"
cp .env.example .env        # Fill in DB and secrets
mvn spring-boot:run

# Frontend
cd "../PH Front end"
npm install
npm run dev
```

- Backend runs at `http://localhost:8080`
- Frontend runs at `http://localhost:5173`

## Environment Variables

- See `.env.example` in both backend and frontend for required configuration.
- Database, JWT secret, upload directory, etc.

## Database

- Create MySQL database named `pizzahouse`
- Import schema from `PH Back end/pizzahouse_20250615.sql`
- Configure credentials in `PH Back end/src/main/resources/application.properties` or `.env`

## API Documentation

- Swagger UI available at `http://localhost:8080/swagger-ui.html` (if enabled)

## Default Admin Credentials

- Username: `admin@pizzahouse.com`
- Password: `Admin@123`


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request


---

See the sub-project READMEs for full setup and advanced usage:
- [Backend README](./PH%20Back%20end/README.md)
- [Frontend README](./PH%20Front%20end/README.md)
