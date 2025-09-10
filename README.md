# PizzaHouse
# Pizza House

A full-stack web application for managing a pizza restaurant ordering system with user authentication, menu management, and order processing capabilities.

## Project Structure

```
PizzaHouse/
├── PH Back end/     # Spring Boot backend
├── PH Front end/    # React + TypeScript frontend
```

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.1.0
- Spring Security
- Spring Data JPA
- MySQL
- Maven
- Lombok

### Frontend
- React
- TypeScript
- Vite
- React Router
- SCSS
- React Toastify

## Features

- User Authentication & Authorization
- Role-based Access Control (Admin/Customer)
- Menu Management
- Order Processing
- Shopping Cart Functionality
- Offer Management System
- User Profile Management
- Previous Orders History
- Item-Offer Mapping

## Prerequisites

### Backend
- JDK 17 or later
- MySQL 8.0 or later
- Maven 3.6 or later

### Frontend
- Node.js
- npm or yarn

## Setup Instructions

### Backend Setup
1. Navigate to `PH Back end` directory
2. Create MySQL database named 'pizzahouse'
3. Configure database credentials in `application.properties`
4. Run:
```bash
mvn clean install
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to `PH Front end` directory
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```
Frontend will start on `http://localhost:5173`

## Default Admin Credentials
- Username: admin
- Password: admin123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.