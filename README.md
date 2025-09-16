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

## Possible Improvements / Future Enhancements

The current implementation is functional to keep things simple for MVP(minimum viable product) of online pizza ordering system, but the following improvements could be added in future versions:

- **Multiple Addresses per User**: Currently, each user can store only one address. This can be improved by allowing users to manage multiple addresses (e.g., Home, Work) via a One-to-Many relationship.
- **Order from History**: Now user can view their past orders but cannot reorder.
- **Payment Integration**: Add support for real payment gateways (e.g., Razorpay, Stripe).
- **Admin Panel**: Now Admin can add item to menu, time bound offers to item. A dashboard for admins to manage users, orders.
- **Product Customization**: Allow users to customize pizzas (extra cheese, toppings, etc.).
- **User Authentication Enhancements**: Now using JWT. Can add OAuth login options (Google, Facebook) for convenience.

These are not yet implemented to keep the initial version simple and focused.


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
