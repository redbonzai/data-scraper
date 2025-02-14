# **Data Scraper API**

## **1. Name**
**Data Scraper API**

## **2. Description**
The **Data Scraper API** is a web service built with **NestJS**, **TypeORM**, and **Puppeteer**. It provides the following key functionalities:

- **Automated Web Scraping**: Extracts contact information (phone numbers, emails, addresses) from web pages.
- **Search Service**: Uses the **Bing Search API** to dynamically discover relevant URLs based on a search query.
- **Database Storage**: Saves scraped contact details in a **PostgreSQL database**.
- **Telemetry Integration**: Pushes scraping and search operation metrics to **Observe Inc.** for monitoring.
- **Dockerized Deployment**: Runs in a self-contained environment using **Docker Compose**.

## **3. Developer Setup**

### **3.1 Prerequisites**
Ensure you have the following installed on your system:
- **Node.js** (v22+)
- **pnpm** (v8+)
- **Docker & Docker Compose**
- **PostgreSQL** (optional, if running locally instead of Docker)

### **3.2 Environment Variables**
Create a `.env` file in the root directory with the following values:

```ini
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=local
POSTGRES_DB=local

# Bing Search API
BING_API_KEY=your_bing_api_key
BING_SEARCH_URL=https://api.bing.microsoft.com/v7.0/search

# Google Search API
GOOGLE_API_KEY=google_api_key
GOOGLE_SEARCH_ENGINE_ID=google_search_engine_id
GOOGLE_SEARCH_URL=https://www.googleapis.com/customsearch/v1

# Observe Inc. Telemetry
OBSERVE_CUSTOMER=your_observe_customer_id
OBSERVE_TOKEN=your_observe_ingest_token
OBSERVE_DATASTREAM=your_datastream_name
```

### **3.3 Secrets Table**

| Secret Name               | Sample Value                                 | Description                                      |
|---------------------------|----------------------------------------------|--------------------------------------------------|
| `DB_HOST`                 | `postgres`                                   | PostgreSQL database host                         |
| `DB_PORT`                 | `5432`                                       | PostgreSQL database port                         |
| `POSTGRES_USER`           | `postgres`                                   | PostgreSQL username                              |
| `POSTGRES_PASSWORD`       | `local`                                      | PostgreSQL password                              |
| `POSTGRES_DB`             | `local`                                      | PostgreSQL database name                         |
| `BING_API_KEY`            | `Bing API KEY`                               | API key for Bing Search API                      |
| `BING_SEARCH_URL`         | `https://api.bing.microsoft.com/v7.0/search` | Bing Search API endpoint                        |
| `GOOGLE_API_KEY`          | `Google API KEY`                             | Bing Search API endpoint                        |
| `GOOGLE_SEARCH_ENGINE_ID` | `Google Search Engine ID`                    | Bing Search API endpoint                        |
| `GOOGLE_SEARCH_URL`       | `https://www.googleapis.com/customsearch/v1` | Bing Search API endpoint                        |
| `OBSERVE_CUSTOMER`        | `your_observe_customer_id`                   | Observe Inc. customer ID                         |
| `OBSERVE_TOKEN`           | `your_observe_ingest_token`                  | Observe Inc. API token for telemetry            |
| `OBSERVE_DATASTREAM`      | `your_datastream_name`                       | Observe Inc. datastream for telemetry           |

### **3.4 Running the Application in Docker**
```bash
docker compose up --build
```
This will:
- Build and start the **NestJS API**
- Start **PostgreSQL** and initialize the database with sample data
- Run all services inside Docker

### **3.5 Verify Database Setup**
To confirm that the database and sample data were created:
```bash
docker exec -it contact-db psql -U user -d contactdb -c "SELECT * FROM \"contact-info\";"
```
This should return the pre-seeded sample contact information.

---

## **4. Services Overview**

### **4.1 Search Service** (`src/domains/search/search.service.ts`)
- Uses the **Bing Search API** to fetch URLs based on a search query.
- Returns a list of **relevant websites** for scraping.
- Pushes search metrics to **Observe Inc.**.

### **4.2 Web Scraper Service** (`src/domains/web-scraper/web-scraper.service.ts`)
- Uses **Puppeteer** to visit websites and extract **contact details**.
- Stores extracted data in the **PostgreSQL database**.
- Pushes scraping success/failure metrics to **Observe Inc.**.

### **4.3 Telemetry Service** (`src/domains/observe-inc/telemetry.service.ts`)
- Sends **metrics** (search success, scrape success, durations) to **Observe Inc.**.
- Helps monitor system performance and failures.

### **4.4 Database Module** (`src/domains/database/database.module.ts`)
- Manages PostgreSQL connection using **TypeORM**.
- Seeds initial sample data from `seed.sql`.
- Provides a **repository for saving contact data**.

### **4.5 API Endpoints**

#### **Search & Scrape**
**POST `/search`** - Searches the internet and scrapes the found URLs.
```json
{
  "query": "senior living accommodations contact websites"
}
```

**POST `/scrape`** - Scrapes a list of URLs directly.
```json
{
  "urls": ["https://example.com"]
}
```

---

## **5. Additional Commands**

### **5.1 Database Management (TypeORM CLI)**
```bash
pnpm run db:create    # Creates database schema
pnpm run db:drop      # Drops database schema
pnpm run db:seed      # Seeds sample data
pnpm run db:reseed    # Drops & re-creates database, then seeds
pnpm run db:migrate   # Runs pending migrations
pnpm run db:rollback  # Reverts last migration
pnpm run db:generate-migration  # Generates a new migration
pnpm run db:run-migrations      # Runs all pending migrations
```

### **5.2 Running Tests**
```bash
pnpm run test         # Run unit tests
pnpm run test:e2e     # Run end-to-end tests
```

---

## **6. Conclusion**
This **Data Scraper API** automates the process of **discovering** and **extracting contact details** from the internet. With **Bing Search API**, **Puppeteer web scraping**, and **Observe Inc. telemetry**, it ensures a scalable and well-monitored data extraction pipeline.

For any issues, refer to the **logs**, and check **Observe Inc. dashboard** for real-time monitoring!

