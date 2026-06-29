To hand off your **RGUKT Connect** project to a platform or standard like Antigravity, you need to provide a precise set of **Implementation & Software Engineering Rules**. These rules act as the strict technical blueprint that ensures any developer or automated pipeline can maintain, extend, and deploy your Java Spring Boot + React + WebSocket infrastructure without breaking real-time states or security constraints.

Here is the structured handbook of engineering rules for your project:

---

##  Architectural & Implementation Rules

### Multi-Tier Architecture Alignment

* **Separation of Concerns:** The backend must strictly follow the Controller-Service-Repository pattern. Controllers handle HTTP/WebSocket framing, Services manage transactional business logic, and Repositories handle database connectivity.
* **Stateless REST, Stateful WebSockets:** All HTTP endpoints (`/api/`) must remain completely stateless, relying on JWT verification per request. Stateful connection tracking must be isolated strictly within the Spring Message Broker environment (`/ws-chat/`).

### Security & Perimeter Guardrails

* **Handshake Security:** The WebSocket endpoint path (`/ws-chat/`) must bypass standard JWT request interception filter chains only for the initial connection upgrade, but must implement channel interceptors if token-based STOMP authentication is added later.
* **Data Privacy (Zero-Leak Policy):** User entities must never expose authentication credentials over the network. The `password` property in the `User` model must be strictly flagged as write-only:
```java
@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)

```


* **Relationship Guardrails:** High-security data domains (like retrieving chat history or transmitting real-time messages) must execute an isolation check via the database before returning data:
```java
boolean isConnected = connectionRepository.areUsersConnected(senderId, receiverId);

```


If false, packets must be dropped silently or return a `403 Forbidden` error.

---

## 2. Core Engineering & Performance Rules

### Database & Persistence Mechanics

* **Query Performance:** Avoid native `SELECT *` loops. Complex multi-user validation checks must run optimized, lightweight aggregations. For example, testing connections should rely on count boolean mappings rather than pulling entire record objects:
```sql
SELECT COUNT(c) > 0 FROM Connection c WHERE ...

```


* **Lazy Loading:** All relational properties (such as `@ManyToOne` hooks inside `ChatMessage`) must explicitly declare lazy fetching (`fetch = FetchType.LAZY`) to prevent catastrophic Hibernate N+1 query execution cascades during heavy traffic.
* **Audit Trails:** Database tables must include immutable database-generated timestamps using annotations like `@CreationTimestamp` to ensure timeline accuracy across timezones.

### Real-Time Protocol Consistency

* **STOMP Over WebSockets:** The frontend and backend must strictly adhere to the STOMP protocol layout. Manual string transmission is prohibited; use standard libraries (`@stomp/stompjs` on React and `SimpMessagingTemplate` on Spring Boot) to automatically manage the initialization (`CONNECT`), subscription (`SUBSCRIBE`), and delivery (`SEND`) lifecycle.
* **User-Isolated Queues:** Peer-to-peer transmissions must route through Spring's user destination prefix configuration (`/user/{userId}/queue/messages`) to prevent global broadcast leaks.

---

## 3. State Management & Frontend Rules

### Session Persistence

* **Atomic State Updates:** Frontend authorization tokens and user data profiles must be committed to local memory updates *before* navigating routes to prevent race conditions where a route guard throws a false validation rejection:
```javascript
localStorage.setItem('userSession', JSON.stringify(sessionData));
onLoginSuccess(sessionData); // Update state first
navigate('/home');          // Route second

```


* **Route Protection:** All functional workspace components (`/home`, `/network`, `/messages`, `/profile`) must be explicitly wrapped inside an authentication guard component that evaluates the current local session state, redirecting unauthenticated traffic to `/login`.

### Clean Coding & Maintenance

* **Environment Extraction:** Hardcoded connection URLs (like `http://localhost:4000`) must be extracted into centralized environment files (`.env` or application configuration profiles) before passing the project codebase forward.
* **Lifecycle Cleanup:** To prevent severe frontend browser memory leaks and hanging background socket ports, all active WebSocket connections must explicitly call their respective termination hooks (`client.deactivate()`) when components unmount or user contexts switch.


Note : Dont add comments in the code and make it look like human written code nothing much complex