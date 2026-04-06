# Forum API – Clean Architecture, Testing, CI/CD & Security

## Overview
This project is a backend RESTful API for a discussion forum platform developed for a fictional company, **Garuda Game**. The system is designed to support an active user community through thread-based discussions, comments, and replies.

The project is developed in **two integrated phases**:

- **Phase 1:** Core API development with Clean Architecture & Automation Testing  
- **Phase 2:** Production readiness with CI/CD pipeline, security, and deployment  

---

## Phase 1 – Core API (Clean Architecture & Testing)
In the first phase, the focus is on building a scalable and maintainable backend system.

### Key Features:
- User Authentication (Register, Login, Logout, Refresh Token)
- Thread Management (Create & View Threads)
- Comment & Reply System (Add/Delete with soft delete)
- Thread Detail with nested comments & replies

### Technical Implementation:
- **Clean Architecture** (Entities, Use Cases, Repository, Framework)
- **Automation Testing**
  - Unit Testing (business logic)
  - Integration Testing (database interaction)
- RESTful API design
- PostgreSQL database

### Goal:
Ensure the system is **robust, maintainable, and scalable**, with high test coverage and clear separation of concerns.

---

## Phase 2 – CI/CD & Security Enhancement
The second phase extends Phase 1 into a production-ready system.

### Key Enhancements:
- **Continuous Integration (CI)**
  - Automated testing (Unit, Integration, Functional)
  - GitHub Actions on pull request

- **Continuous Deployment (CD)**
  - Auto-deploy to server (e.g., AWS EC2) on push to main branch

- **Security Implementation**
  - Rate Limiting (90 requests/minute) to prevent DDoS
  - HTTPS protocol to prevent MITM attacks
  - NGINX configuration for access control

- **Infrastructure**
  - Cloud database (Amazon RDS) / containerized DB
  - Deployment automation via SSH / CI pipeline

### Optional Features:
- Like / Unlike comments
- Enhanced thread interaction features

---

## Project Relationship
Phase 2 is a **direct continuation of Phase 1**, where:
- The same Forum API system is enhanced
- Focus shifts from **development → production readiness**
- Adds **DevOps, security, and deployment practices**

---

## Tech Stack
- **Backend:** Node.js, Hapi.js / Express
- **Database:** PostgreSQL
- **Testing:** Jest
- **Architecture:** Clean Architecture
- **CI/CD:** GitHub Actions
- **Cloud & DevOps:** AWS (EC2, RDS), NGINX
- **Security:** HTTPS, Rate Limiting

---

## Key Highlights
- End-to-end backend development (design → testing → deployment)
- Implementation of Clean Architecture principles
- High test coverage with automation testing
- CI/CD pipeline integration
- Production-level security practices

---

## Notes
This project demonstrates the transition from:
**Software Engineering (Phase 1) → DevOps & Production Engineering (Phase 2)**
