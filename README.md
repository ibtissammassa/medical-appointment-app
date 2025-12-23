# Medical Appointment API

This project is a technical assessment that features a Laravel-based RESTful API and a minimal React client designed to handle high-concurrency medical booking scenarios while ensuring data integrity.

## Concurrency Control

The primary goal of this assignment was to prevent double-bookings. To achieve this, I implemented a multi-layered defense strategy:

### 1. Database-Level Integrity (The Safety Net)

As a final safeguard, I implemented **Unique Database Constraints**. A unique composite index on the `appointments` table ensures that the database itself will reject any attempt to save a duplicate slot for the same doctor at the same time.

### 2. Service-Layer Locking (Pessimistic Locking)

To manage the "Race Condition" where two users attempt to book the same slot simultaneously, I utilized:

- **Database Transactions**: Ensuring atomicity of the booking process.
- **SQL `SELECT...FOR UPDATE`**: This mechanism locks the specific time slot during the transaction, forcing concurrent requests to wait until the first is resolved.
- **Conflict Handling**: If a slot is taken during the transaction, the API returns an **HTTP 409 Conflict**.

## Tech Stack

- **Backend:** PHP 8.1+ with Laravel
- **Database:** PostgreSQL
- **Frontend:** Minimal React Client (Vite)
- **Environment:** Docker Compose

## Business Rules

- **Operating Hours:** Monday through Friday, 09:00 to 17:00.
- **Slot Duration:** Strictly 30-minute intervals (e.g., 09:00, 09:30).
- **Schema:** Doctors include name and specialization; Appointments include doctor ID, patient name, and status.

---

# Setup Instructions

### 1. Environment Setup

Clone the repository and start the services using **Docker Compose**.

```bash
git clone https://github.com/ibtissammassa/medical-appointment-app.git
cd medical-appointment-app
docker-compose up --build
```

This will start:
- Laravel application on `http://localhost:8000`
- PostgreSQL database on port 5432

Copy the environment file and configure database settings:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update the database configuration to use PostgreSQL:

```env

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=clinic
DB_USERNAME=clinic_user
DB_PASSWORD=secret

```

Generate APP_KEY (optional):

```bash
docker-compose exec app php artisan key:generate
```

### 2. Backend Initialization

Create the database tables:

```bash
docker-compose exec app php artisan migrate
```

Populate the database with sample data (Optional):

```bash
docker-compose exec app php artisan db:seed
```

### 3. Frontend Initialization

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

## Usage
- Backend API: `http://localhost:8000`
- Frontend Client: `http://localhost:5173`
- Database: `localhost:5432` (accessible from host for development tools)
  
## API Endpoints

| Method   | Endpoint                                         | Description                                          | Required Logic                                                |
| :------- | :----------------------------------------------- | :--------------------------------------------------- | :------------------------------------------------------------ |
| **GET**  | `/api/doctors`                                   | Return a JSON list of all doctors.                   | Basic index fetch.                                            |
| **GET**  | `/api/doctors/{id}/availability?date=YYYY-MM-DD` | Dynamically calculate 30-minute slots (09:00-17:00). | Filter out already booked slots.                              |
| **POST** | `/api/appointments`                              | **CRITICAL:** Book a specific appointment slot.      | Use database transactions and explicit locking for atomicity. |

## Troubleshooting

- Ensure Docker is running before starting services
- Check container logs: `docker-compose logs`
- Verify environment variables in `backend/.env`
- Make sure ports 8000, 5432, and 5173 are available
