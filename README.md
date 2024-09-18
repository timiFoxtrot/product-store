# product-store-api

# About

Server-Side implementation for a simple product store app. The API uses a cloud mongodb uri `mongodb+srv://timiajibade24:naU29kqtGJAyWY23@cluster0.sbgkj.mongodb.net/` for database connection.

## Installation

To clone the project:

```bash
https://github.com:timiFoxtrot/product-store.git
```

`cd` into the `product-store` directory

```bash
cd product-store
```

create a `.env` file with actual values similar to the `.env.example` file.

install project dependencies

```
npm install
```

compile Typescript files to Javascript

```bash
npm run build
```

run the project

```bash
npm run start:dev
```

### Steps to Build and Run the App using Docker

Build the Docker image

```bash
docker build -t product-store .
```

Run the app using Docker Compose:

```bash
docker-compose up
```

Stop the app

```bash
docker-compose down
```

### Environment Variables:

```bash
PORT=3000
JWT_SECRET=yoursecretissafeornot
MONGODB_URL=mongodb+srv://timiajibade24:naU29kqtGJAyWY23@cluster0.sbgkj.mongodb.net/
```
