# 🌱 AgriOne – Smart Agricultural Management Platform

<p align="center">
  <strong>An Integrated Digital Ecosystem for Modern Agriculture</strong>
</p>

<p align="center">
  <a href="https://agri-one-app.vercel.app/">Live Demo</a> •
  <a href="https://github.com/Laur3nt1uu/AgriOne-App">GitHub Repository</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/IoT-Integration-orange" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

---

## 📖 Overview

**AgriOne** is an integrated Smart Agriculture Management Platform designed to modernize agricultural operations through the combination of full-stack web development, geospatial technologies, database engineering, and Internet of Things (IoT).

The platform provides a centralized digital environment for managing agricultural land, monitoring field conditions, organizing farming activities, and analyzing operational data.

By connecting web-based management tools with IoT sensor infrastructure, AgriOne aims to bridge the gap between traditional farming practices and modern data-driven agriculture.

The system brings together land management, agricultural operations, sensor monitoring, analytics, and administrative tools within a unified application.

## 🎯 Project Objectives

- Digitize agricultural land administration and management.
- Provide centralized management of agricultural operations and resources.
- Enable IoT-based field monitoring and telemetry collection.
- Visualize agricultural properties using interactive geospatial maps.
- Improve operational visibility through analytics and KPI dashboards.
- Support informed decision-making through structured agricultural data.
- Provide a scalable architecture for future agricultural technology integrations.

## ✨ Key Features

### 🌾 Agricultural Land Management
- Create and manage agricultural properties.
- Interactive geographic mapping and land boundary visualization.
- Polygon-based field drawing and spatial data management.
- Geographic information and area management.

### 📡 IoT & Smart Monitoring
- Integration with Arduino-based sensor infrastructure.
- Sensor pairing and device management.
- Telemetry ingestion and data collection.
- Monitoring of environmental and soil conditions.
- Configurable sensor thresholds and monitoring alerts.
- Historical sensor data visualization.

### 📊 Analytics & Dashboard
- Centralized agricultural management dashboard.
- Operational KPIs and statistical insights.
- Agricultural activity monitoring.
- Data visualization and reporting.
- Weather-related information and monitoring capabilities.

### 🔐 Authentication & Security
- User registration and authentication.
- Google OAuth integration.
- JWT-based authentication and refresh tokens.
- Role-based access control.
- Input validation and API protection.
- Rate limiting and secure password handling.

### 🌍 User Experience
- Responsive and mobile-friendly interface.
- Romanian and English language support.
- Dark and light themes.
- Progressive Web App (PWA) capabilities.
- Modular and intuitive application interface.

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| UI & Interaction | Modern component-based architecture, Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Geospatial | PostGIS, Google Maps |
| ORM | Sequelize |
| Authentication | JWT, Google OAuth |
| Validation | Zod |
| IoT Hardware | Arduino, environmental sensors |
| Communication | REST APIs, telemetry ingestion |
| Development Tools | Git, GitHub, VS Code |

## 🏗️ System Architecture

AgriOne follows a modular full-stack architecture that separates the presentation layer, backend services, database infrastructure, and IoT communication components.

```text
                    AGRIONE PLATFORM
                           |
             +-------------+-------------+
             |                           |
        WEB APPLICATION              IoT DEVICES
             |                           |
       React + Vite                  Arduino
             |                           |
             |                     Sensor Data
             |                           |
             +-------------+-------------+
                           |
                      REST APIs
                           |
                    Node.js / Express
                           |
              +------------+------------+
              |                         |
        Authentication              Application
        & Authorization               Services
              |                         |
              +------------+------------+
                           |
                    PostgreSQL
                           |
                        PostGIS
                           |
              Geographic & Operational Data
```

### Architecture Components

**Frontend Layer**

Provides the user interface, interactive dashboards, geographic visualization, and application navigation.

**Backend Layer**

Handles business logic, authentication, authorization, API endpoints, data validation, and communication with external services.

**Database Layer**

Stores application data, agricultural records, user information, and geospatial information using PostgreSQL and PostGIS.

**IoT Layer**

Connects physical sensor devices with the application through telemetry ingestion endpoints and device management functionality.

## 📂 Repository Structure

```text
AgriOne-App/
│
├── frontend/                  # React web application
│
├── backend/                   # Node.js backend services
│
├── arduino/                   # Arduino firmware and sensor integration
│
├── tools/
│   └── agrione-serial-bridge/  # Serial communication bridge
│
├── .cursor/
│   └── skills/                # Development workflow resources
│
├── .vscode/                   # Editor configuration
│
├── PREMIUM_FEATURES_ROADMAP.md
├── PRODUCTION_AUDIT_REPORT.md
├── package.json
└── package-lock.json
```

## 🗺️ Geospatial Integration

Geospatial functionality is an important part of AgriOne.

The application integrates interactive mapping capabilities to support agricultural land visualization, geographic boundary management, and spatial data operations.

Using Google Maps and PostGIS, the system connects geographic information with the application's agricultural management functionality.

## 🔌 IoT Integration

AgriOne extends beyond traditional web applications by incorporating hardware-based monitoring capabilities.

Arduino-based devices collect environmental and soil-related measurements, which can be transmitted to the backend through dedicated telemetry ingestion endpoints.

The collected information can then be processed, stored, and visualized within the application.

This architecture creates a foundation for connecting physical agricultural environments with centralized digital management tools.

## 🚀 Live Application

Explore the deployed application:

**[AgriOne – Live Demo](https://agri-one-app.vercel.app/)**

**[View Source Code on GitHub](https://github.com/Laur3nt1uu/AgriOne-App)**

## 🔮 Future Development

AgriOne is designed with extensibility in mind. Potential development directions include:

- Advanced agricultural analytics and reporting.
- AI-powered agricultural decision-support features.
- Extended IoT sensor networks and monitoring capabilities.
- Satellite imagery and crop health analysis.
- Additional external agricultural data integrations.
- Advanced farm performance and resource optimization.

## 👨‍💻 Author

**Laurențiu-Marian Busuioc**

Economic Informatics Graduate | Master's Student – Databases and Software Technologies

Bucharest, Romania

- GitHub: [@Laur3nt1uu](https://github.com/Laur3nt1uu)
- Project: [AgriOne-App](https://github.com/Laur3nt1uu/AgriOne-App)

---

<p align="center">
  <strong>AgriOne – Bringing Agriculture into the Digital Era. 🌱</strong>
</p>
