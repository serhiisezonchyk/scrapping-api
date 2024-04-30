# Web Scraping Application

This web application is developed using Node.js and Express.js to scrape data from a static web page and store it in various formats such as JSON, CSV, and upload it to a Google Spreadsheet. It also provides authentication and authorization functionalities using JWT tokens and stores user information and parse requests in a PostgreSQL database.

## How it Works

### The application offers the following functionalities:

1. User Authentication: Users can sign up, log in, and log out using JWT tokens. User authentication is implemented to ensure secure access to the scraping functionality.
2. Web Scraping: The application scrapes data from a static web page using Cheerio.js. The parsed data includes information about speakers, such as their name, role, image, and social media links.
3. Data Storage: Scraped data can be stored in three different formats:

- JSON file
- CSV file
- Uploaded to a Google Spreadsheet

4. Endpoint: The main endpoint /parse initiates the data scraping process and saves the data to the specified locations and formats. Access to this endpoint is restricted to authorized users only.
5. Database: The application utilizes a PostgreSQL database with two tables:

- users: Stores user information including email and hashed passwords.
- parse_requests: Records information about users who called the /parse endpoint.

### Endpoints

#### **/api/auth**

- **POST: /sign-up** - Creates a new user with email and password.(Middlewares: validateData)
- **POST: /login** - Logs in a user with email and password, providing a JWT token for authentication.
- **GET: /logout** - Logs out the currently authenticated user.

#### **/api/parse**

- **GET: /** - Initiates the data scraping process and saves the data to specified locations and formats.(Middlewares: verifyToken, logginAttemp)
- **GET: /my-parsed-requests** - Retrieves information about parse requests made by the authenticated user.(Middlewares: verifyToken)
- **GET: /parsed-requests** - Retrieves information about all parse requests made by users.(Middlewares: verifyToken)

### Middlewares

- **logginAttemp** - Create new raw in parse_requests when user trying scrape data.
- **verifyToken** - Ensure authentication.
- **validateData** - Validate request body against a schema

## Tools Used

- **TypeScript**: A statically typed superset of JavaScript that adds optional static typing to the language, providing enhanced tooling, type safety, and better code organization.
- **Node.js**: A JavaScript runtime environment for building server-side applications.
- **Express.js**: A web application framework for Node.js, providing features for building APIs and web applications.
- **Cheerio.js**: A fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- **JSON Web Tokens (JWT)**: A compact, URL-safe means of representing claims to be transferred between two parties.
- **bcrypt**: A library to help you hash passwords.
- **Prisma**: A database toolkit and ORM for Node.js and TypeScript.
- **Google API**: Enables programmatic access to Google APIs.
- **json2csv**: Trasforming json to csv.
- **HTTP Status Codes**: A library providing a convenient set of named HTTP status codes.
- **Zod**: A TypeScript-first schema declaration and validation tool. It ensures data integrity by providing a way to define schemas for data validation.
- **Prettier**: An opinionated code formatter that enforces a consistent code style across your project, making the codebase more readable and maintainable.

## Installation

1. Clone the project repository from your version control system.
2. Install dependencies using npm (Node Package Manager).

```bash
npm install
```

3. Ensure your PostgreSQL database is running.
4. Generate db schema.

```bash
npm run generate
```

5. Push schema to database.

```bash
npm run push
```

6. Starting the server

```bash
npm run dev
```

## Docker

1. Set up .env with outer database
2. To build the Docker image, run the following command in your terminal:

```bash
docker build -t scrapping-server .
```

3. Run the Docker container using:

```bash
   docker run -p 8080:8080 --env-file .env scrapping-server
```
