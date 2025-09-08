# Pizza House Application

A Spring Boot application for managing a pizza restaurant ordering system.

## Technologies Used

- Java 17
- Spring Boot 3.1.0
- Spring Security
- Spring Data JPA
- MySQL
- Maven
- Lombok

## Features

- User authentication and authorization
- Pizza menu management
- Order processing
- User profile management
- Shopping cart functionality

## Prerequisites

- JDK 17 or later
- MySQL 8.0 or later
- Maven 3.6 or later

## Setup Instructions

1. Clone the repository
2. Create MySQL database named 'pizzahouse'
3. Update database credentials in `application.properties` if needed
4. Run the following commands:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
5. Access the application at `http://localhost:8080`

## Default Credentials

- Username: admin
- Password: admin123

## Project Structure

```
pizzaHouse/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/springboot/pizzaHouse/
│   │   │       ├── controllers/    # REST controllers
│   │   │       ├── model/         # Domain models
│   │   │       ├── repository/    # JPA repositories
│   │   │       └── services/      # Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
