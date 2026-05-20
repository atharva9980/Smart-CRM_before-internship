readme_content = """# 🚀 SmartCRM: AI-Powered Support Triaging System

## ⚠️ The Real-World Problem
Modern customer service teams are drowning in unprioritized support tickets. In a traditional queue, a critical issue (e.g., "Production server is down and we are losing money") is often placed behind ten low-priority requests (e.g., "How do I change my avatar?"). 

This lack of intelligent routing leads to:
* **SLA Breaches:** Critical issues are not addressed in time.
* **Agent Burnout:** Support staff waste cognitive energy manually reading and sorting tickets instead of solving them.
* **Customer Churn:** Frustrated enterprise clients leave due to poor response times on urgent matters.

## 💡 The Solution
**SmartCRM** is a full-stack, containerized microservice application that solves this by acting as an intelligent interceptor. 

Whenever a customer submits a ticket through the portal, the Spring Boot backend instantly routes the raw text to a **Local Large Language Model (Llama 3)**. The AI analyzes the sentiment and context of the issue, categorizes it (e.g., `TECH_SUPPORT`, `BILLING`), and assigns a priority (`HIGH`, `MEDIUM`, `LOW`). 

The ticket is then placed into a distinct, color-coded Service Cloud Console for agents, ensuring that high-priority issues are always resolved first.

---

## 🏗️ Architecture & Technical Focus

This project is built using an enterprise-grade microservice architecture, emphasizing **Data Privacy** (by running the LLM entirely offline via Ollama) and **Separation of Concerns** (distinct portals for customers and agents).

### Tech Stack
* **Backend:** Java 17, Spring Boot 3.2.x, Spring Data JPA, Spring Web
* **AI Integration:** Spring AI, Ollama (Llama 3 / Mistral)
* **Frontend:** React, Vite, Tailwind CSS v4, React Router DOM
* **Database:** PostgreSQL 15
* **Containerization:** Docker, Docker Compose

### Key Features
1. **Zero-Latency AI Triaging:** Uses `spring-ai-ollama` to execute structured prompts against a local LLM, returning deterministic JSON arrays for database storage.
2. **Role-Based Access Control (RBAC):** Custom JWT/Session authentication separating the `CUSTOMER` SmartHelp Portal from the `AGENT` Service Console.
3. **Smart Receipts:** Customers receive instant feedback on their ticket's classification and dynamically generated Expected Response Times based on the AI's priority assessment.
4. **Fully Dockerized:** The application networks the isolated React, Java, and PostgreSQL containers while securely exposing the host machine's Ollama instance.

---

## 🚀 How to Run the Application

Because this system relies heavily on local AI inference, the LLM runs on your host machine while the application runs inside Docker.

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install [Ollama](https://ollama.com/)
3. Ensure ports `8080`, `5173`, `5432`, and `11434` are available.

### Step 1: Start the Local AI
Open a terminal on your host machine and download/start the Llama 3 model. Leave this terminal running.
