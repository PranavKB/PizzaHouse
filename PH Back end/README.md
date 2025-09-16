# Pizza House Backend

A robust backend API for the Pizza House ordering system.  
Built with Spring Boot, Maven, and supports RESTful endpoints, authentication, and file uploads.

## Technologies Used

- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security (JWT)
- Maven
- MySQL (or compatible RDBMS)
- Docker (optional)

## Features

- User registration, authentication (JWT)
- Menu and product management
- Shopping cart and order processing
- Profile and session management
- File uploads (images, receipts, etc)
- Secure REST API for frontend integration

## Project Structure

```
PH Back end/
├── .env.example           # Sample environment variables
├── .gitattributes
├── .gitignore
├── .mvn/                  # Maven wrapper files
├── mvnw, mvnw.cmd         # Maven wrapper scripts
├── pom.xml                # Maven project configuration
├── pizzahouse_20250615.sql# Database schema/init script
├── README.md
├── src/
│   ├── main/
│   │   ├── java/          # Application source code
│   │   └── resources/     # Config, application.properties, static files
│   └── test/              # Test code
├── uploads/               # Directory for uploaded files
```

## Getting Started

### Prerequisites

- Java 17 or newer
- Maven 3.8+
- MySQL
- (Optional) Docker for containerized runs

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


### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PranavKB/PizzaHouse.git
   cd "PH Back end"
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in values (DB, JWT secret, etc).

3. **Initialize Database**
   - Create a MySQL database (e.g. `pizzahouse`).
   - Import the schema:
     ```bash
     mysql -u <user> -p <db_name> < pizzahouse_20250615.sql
     ```

4. **Configure application properties**
   - Edit `src/main/resources/application.properties` for DB credentials and other secrets.

5. **Build and run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

   Or build a JAR:
   ```bash
   ./mvnw clean package
   java -jar target/*.jar
   ```

6. **API base URL:**  
   The server runs on [http://localhost:8080](http://localhost:8080) by default.

### Running Tests (In Progress)

```bash
./mvnw test
```

## API Endpoints

- `/api/auth/*` – Authentication (register, login, JWT)
- `/api/menu/*` – Menu operations
- `/api/cart/*` – Cart management
- `/api/order/*` – Place and manage orders
- `/api/profile/*` – User profile
- `/api/upload/*` – File uploads

> For full API documentation, see the Swagger UI:  
> [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (if enabled)

## Environment Variables

See `.env.example` for required variables:
```
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=
JWT_SECRET=
UPLOAD_DIR=
...
```

## Best Practices

- Use environment variables for secrets and connection info.
- Keep uploaded files out of source control (`uploads/` is in `.gitignore`).
- Write modular controllers, services, and repositories.
- Use DTOs for request/response payloads.
- Secure endpoints with JWT and Spring Security.
- Maintain tests in `src/test/`.

## Deployment

- Use Docker for containerized deployment (add a `Dockerfile` if needed).
- Use CI/CD for automated builds and tests.


## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit descriptive messages
4. Push and open a Pull Request


---

See [`PH Front end/README.md`](../PH%20Front%20end/README.md) for frontend setup.