<p align="center">
  <img src="logo.png" height="200" alt="Exzly Logo">
</p>

# Exzly

- [Exzly](#exzly)
  - [Description](#description)
  - [Installation](#installation)
    - [Install Packages](#install-packages)
    - [Copy the Environment File](#copy-the-environment-file)
    - [Database Configuration](#database-configuration)
    - [Security Settings](#security-settings)
    - [SMTP Settings](#smtp-settings)
  - [Migration and Seeder](#migration-and-seeder)
  - [Linter and Formatter](#linter-and-formatter)
  - [Running the Project](#running-the-project)
  - [License](#license)

> Starting point for a monolithic Express.js application

## Description

Exzly is a foundational template designed to accelerate the development of scalable and efficient monolith applications. It incorporates commonly used packages and best practices, making it easy to extend and adapt for various use cases.

This boilerplate is a perfect starting point for building modern, efficient, and maintainable applications with Express.js.

## Installation

To get started with Exzly, follow the steps below:

### Install Packages

Run the following command to install the required packages:

```bash
npm install
```

### Copy the Environment File

Duplicate the example `.env` file to create your configuration file:

```bash
cp .env.example .env
```

### Database Configuration

Update the database settings in the [`config.json`](/database/config.json) file according to your environment.

### Security Settings

Modify the security configurations in the [`security.js`](/src/config/security.js) file.

### SMTP Settings

Configure SMTP details in the [`smtp.js`](/src/config/smtp.js) file.

## Migration and Seeder

Handle database migrations and seeders as follows:

- **Run all migrations and seeders for development:**

  ```bash
  npm run db:demo
  ```

- **Run all migrations and seeders for production:**

  ```bash
  npm run db:start
  ```

  This command ensures no fake data is generated.

- **Run a specific migration:**

  ```bash
  npx sequelize-cli db:migrate --name base-1.0.0.js
  ```

- **Run specific seeders:**

  - Start seeder (used for production, no fake data):

    ```bash
    npx sequelize-cli db:seed --seed start
    ```

  - Demo seeder (includes fake data for testing purposes):
    ```bash
    npx sequelize-cli db:seed --seed demo
    ```

## Linter and Formatter

Keep your code clean and consistent by using the following commands:

- **Run linter:**

  ```bash
  npm run lint
  ```

- **Run formatter:**
  ```bash
  npm run format
  ```

## Running the Project

Run the project in the desired mode:

- **Production mode:**

  ```bash
  npm start
  ```

- **Development mode:**
  ```bash
  npm run start:dev
  ```

## License

Exzly is distributed under the [MIT License](./LICENSE).
