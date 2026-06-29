# RGUKT Connect: Backend Architecture Overview & Analysis

This document provides a technical analysis of the backend implementations present in the `rgukt-connect` repository.

---

## 1. Dual-Backend Setup

The repository features two distinct backend implementations side by side:
1. **`backend/`**: A Java Spring Boot application (serving on port `4000`).

Currently, the frontend points to the **Spring Boot backend** on port `4000` for authentication (registration and login), while other features like messaging and profiles currently rely on mock data on the frontend, even though the Spring Boot backend has implementations for them.

---

## 2. Spring Boot Backend (`backend/`)

### Tech Stack
* **Runtime & Build**: Java 21, Maven, Spring Boot 4.0.6
* **Database & ORM**: MySQL (`jdbc:mysql://localhost:3306/rgukt_connect`), Spring Data JPA, Hibernate (DDL-auto: `update`)
* **Security & Auth**: Spring Security + JWT (`io.jsonwebtoken` version `0.11.5`)
* **File Storage**: AWS S3 SDK (`software.amazon.awssdk:s3` version `2.44.12`)
* **Real-time Messaging**: Spring WebSocket (`spring-boot-starter-websocket`)
* **Boilerplate reduction**: Project Lombok

### Directory Structure & Package Layout
`src/main/java/com/uday/rguktconnect/`
* **`config/`**: Sets up Spring Beans, security constraints, S3 clients, and WebSocket message brokers.
* **`controller/`**: Exposes REST endpoints and WebSocket handlers:
  * `UserController.java`: `/api/auth/register` (POST) and `/api/auth/login` (POST).
  * `ProfileController.java`: `/api/users/profile` (GET), updates metadata/photo, and CRUD for projects, experiences, and education records.
  * `ConnectionController.java`: Connection requests, acceptance, rejection, and retrieval of connection lists.
  * `MessageController.java`: WebSocket messaging via `@MessageMapping("/chat.sendMessage")` and `/api/chat/history/{targetUserId}` (GET).
  * `PostController.java`: Empty/Stubbed.
* **`entity/`**: Relational JPA mappings:
  * `User.java`: Core auth details (`idNumber` matching RGUKT format, `universityEmail`, etc.).
  * `UserDetails.java`: profile bio, branch, batch, S3/base64 avatar, social links.
  * `EducationDetail.java`, `Project.java`, `UserExperiences.java`: Relational tables linked to `User`.
  * `Connection.java`: Maps sender/receiver relations with states (`PENDING`, `ACCEPTED`).
  * `ChatMessage.java`: Message body, sender/receiver relation, and timestamps.
* **`repository/`**: Interfaces extending `JpaRepository` grouped by connection, messages, and user.
* **`security/`**: JWT Filters, utilities, and `UserDetailsService` implementation.
* **`service/`**: Declarative interfaces and implementations (e.g. `FileStorageService` for S3 uploads).

---

## 3. MERN Backend (`backend-mern/`)

### Tech Stack
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express (v5.2.1)
* **Database**: MongoDB + Mongoose (v9.6.2)
* **Security & Auth**: Bcrypt (v6.0.0), JSON Web Tokens (JWT)

### Directory Structure
`src/`
* **`config/db/`**: Handles database connection to MongoDB.
* **`controllers/`**: 
  * `user.controller.js`: Features registration and login.
* **`models/`**: Defines flexible MongoDB documents (schemas):
  * `user.model.js`: Complete model embedding education schemas, experience schemas, skills arrays, and featured projects in a single document.
  * `connection.model.js`: Connections between User schemas.
  * `conversation.model.js` & `message.model.js`: Real-time chat tracking.
  * `job.model.js`: Postings by alumni for referrals, including job type, work mode, and applicant details.
  * `notification.model.js`: Models for likes, comments, connections, and referral events.
  * `post.model.js`: Post structures with likes, comments, and categories.
* **`routes/`**: Exposes REST endpoints:
  * `user.routes.js`: `/register`, `/login`, `/logout` (with JWT validation).
* **`middlewares/`**:
  * `auth.middleware.js`: Custom `verifyJWT` implementation extraction tokens from cookies or Authorization headers.

---

## 4. Feature Coverage & Comparison

| Feature | Spring Boot Backend (`backend/`) | MERN Backend (`backend-mern/`) |
| :--- | :--- | :--- |
| **Authentication** | Fully implemented (JWT) | Fully implemented (JWT + Cookie option) |
| **User Profiles** | Fully implemented (Basic details + S3 upload + relational tables) | Model defined; controllers/routes not fully implemented yet |
| **Connections** | Fully implemented (Accept, Reject, List) | Model defined; controllers/routes not fully implemented yet |
| **Messaging** | Fully implemented (WebSocket + Database History) | Models defined (Message, Conversation); controllers/routes not fully implemented yet |
| **Posts** | Stubbed (empty controller/service) | Model defined (Post); controllers/routes not fully implemented yet |
| **Jobs / Referrals** | Not modeled or implemented | Model defined (`Job`); controllers/routes not fully implemented yet |
| **Notifications** | Not modeled or implemented | Model defined (`Notification`); controllers/routes not fully implemented yet |

---

## 5. Architectural Findings

1. **Frontend Integration**: The frontend React code currently only sends HTTP requests for Registration/Login (pointing to the Spring Boot backend on port `4000`). Other views (Messages, Profile) currently render local mock data and have not been hooked up to either API.
2. **Implementation vs. Modeling**:
   * The **Spring Boot** backend has the most complete, active API implementations (Profile updates, connections, real-time messaging using WebSockets). However, it lacks Post, Notification, and Job features.
   * The **MERN** backend has modeled almost all desired application features (Jobs, Notifications, Posts, Conversations) inside MongoDB schemas but lacks the actual controller methods and Express routers to expose them to the frontend.
3. **Database Choice**:
   * Spring Boot uses a SQL approach (MySQL/PostgreSQL) with relational models (`UserDetails`, `EducationDetail`, `UserExperiences`, `Project` split across tables).
   * MERN uses a Document-oriented approach (MongoDB), embedding arrays of experiences, education, and projects directly inside the `User` document, which simplifies profile queries.
