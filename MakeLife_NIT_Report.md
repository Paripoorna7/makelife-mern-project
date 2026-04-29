MakeLife — Orphanage Management System

Project Report Submitted in Partial Fulfilment of the Requirements for the Degree of

Bachelor of Technology (Hons.)

in

Computer Science and Engineering

---

Submitted by

Name of the Student 1: ________________ (Roll No. ________)

Name of the Student 2: ________________ (Roll No. ________)

Name of the Student 3: ________________ (Roll No. ________)

---

Under the Supervision of

<Supervisor Name>

<Designation>

---

Department of Computer Science and Engineering

National Institute of Technology Jamshedpur

<Month, Year>

---

---

CERTIFICATE

This is to certify that the report entitled "MAKELIFE — ORPHANAGE MANAGEMENT SYSTEM" is a bonafide record of the Project done by ________ (Roll No.: 20XXUGCSXXX), ________ (Roll No.: 20XXUGCSXXX) and ________ (Roll No.: 20XXUGCSXXX) under my supervision, in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology (Hons.) in Computer Science and Engineering from National Institute of Technology Jamshedpur.

&nbsp;

Dr./Mr./Ms. ________ (Guide)

Designation

Computer Science and Engineering

&nbsp;

Date: DD Month YYYY

Department Seal

---

---

DECLARATION

I certify that the work contained in this report is original and has been done by us under the guidance of my supervisor(s). The work has not been submitted to any other Institute for any degree. I have followed the guidelines provided by the Institute in preparing the report. I have conformed to the norms and guidelines given in the Ethical Code of Conduct of the Institute. Whenever I have used materials (data, theoretical analysis, figures, and text) from other sources, I have given due credit to them by citing them in the text of the report and giving their details in the references. Further, I have taken permission from the copyright owners of the sources, whenever necessary.

&nbsp;

Signature of the Students

| Roll Number | Name | Sign |
|-------------|------|------|
| | | |
| | | |
| | | |

---

---

ACKNOWLEDGEMENT

It gives us a great sense of pleasure to present the report of the Project Work undertaken during B.Tech. Final Year. We owe a special debt of gratitude to our Project Supervisor, <Supervisor Name>, <Designation>, Department of Computer Science and Engineering, National Institute of Technology Jamshedpur, for constant support and guidance throughout the course of this work. It is only through their cognizant efforts that our endeavors have seen the light of the day.

We extend our deepest thanks to the faculty members of the Department of Computer Science and Engineering, NIT Jamshedpur, for their valuable suggestions and encouragement during the development of this project.

We also take the opportunity to acknowledge the contribution of the Head of Department and all faculty members for their kind assistance and cooperation during the development of this project. Their insights into software engineering, web technologies, and database management greatly influenced the design and implementation of MakeLife.

We are grateful to the open-source community behind MongoDB, Express.js, React.js, and Node.js, whose tools and documentation made this project possible. We also acknowledge Cloudinary and Vercel for providing free-tier cloud services that enabled the deployment of this application.

Last but not the least, we acknowledge our friends and family for their constant encouragement and support throughout the completion of this project.

&nbsp;

________________ <Roll No.>

________________ <Roll No.>

________________ <Roll No.>

---

---

ABSTRACT

MakeLife is a full-stack web application developed to digitize and streamline the operations of a child welfare Non-Governmental Organization (NGO). Built on the MERN stack (MongoDB, Express.js, React.js, Node.js), the system provides a unified platform for managing child profiles, monetary donations, goods donations, adoption applications, volunteer registrations, and team member profiles. The application is deployed on cloud platforms — Vercel for the frontend and Railway for the backend — with Cloudinary integrated for persistent image storage.

The primary objective of this project is to replace manual, paper-based NGO workflows with a secure, responsive, and scalable web application. The system features a public-facing website where donors can make monetary or goods donations, users can apply for child adoption, and volunteers can register their interest. An administrative dashboard with eleven management tabs provides NGO staff with complete control over all operations, including approval and rejection workflows for adoptions, goods donations, and volunteer requests.

The system implements JSON Web Token (JWT) based authentication with bcrypt password hashing for secure user management. All image uploads are handled through Cloudinary's cloud storage, ensuring photographs of children and team members persist across server redeployments. The application is fully responsive, supporting mobile, tablet, and desktop viewports with adaptive layouts.

Testing confirmed that all twenty-eight functional test cases passed successfully, including duplicate adoption prevention, 10-digit phone validation, responsive slideshow rendering, and Cloudinary image persistence. The project demonstrates the practical application of modern web development technologies to solve real-world problems faced by child welfare organizations in India.

---

---

LIST OF CONTENTS

```
Certificate ......................................................................................   i
Declaration ......................................................................................  ii
Acknowledgement ..................................................................................  iii
Abstract .........................................................................................  iv
List of Contents .................................................................................   v
List of Abbreviations ............................................................................  vi
List of Figures ..................................................................................  vii
List of Tables ...................................................................................  viii


1   Introduction .................................................................................   1
    1.1  Introduction ............................................................................   1
    1.2  Problem Definition ......................................................................   2
    1.3  Objectives ..............................................................................   3
    1.4  Outline of the Report ...................................................................   3

2   Literature Review ............................................................................   4
    2.1  Existing NGO Management Systems .........................................................   4
    2.2  Reference NGOs and Orphanages ...........................................................   5
    2.3  Limitations of Existing Systems .........................................................   6
    2.4  Proposed Solution .......................................................................   6

3   System Requirements ..........................................................................   7
    3.1  Functional Requirements .................................................................   7
    3.2  Non-Functional Requirements .............................................................  11
    3.3  Hardware Requirements ...................................................................  12
    3.4  Software Requirements ...................................................................  12
    3.5  Use Case Descriptions ...................................................................  13

4   System Design ................................................................................  16
    4.1  System Architecture .....................................................................  16
    4.2  Data Flow Diagram — Level 0 (Context Diagram) ...........................................  17
    4.3  Data Flow Diagram — Level 1 .............................................................  18
    4.4  Frontend Architecture ...................................................................  21
    4.5  Backend Architecture ....................................................................  25
    4.6  Entity Relationship Diagram .............................................................  29
    4.7  Database Schema Design ..................................................................  33

5   Implementation ...............................................................................  35
    5.1  Technology Stack ........................................................................  35
    5.2  Frontend Implementation .................................................................  36
    5.3  Backend Implementation ..................................................................  37
    5.4  Authentication Module ...................................................................  38
    5.5  Cloudinary Integration ..................................................................  38
    5.6  Module-wise Implementation ..............................................................  39

6   Screenshots ..................................................................................  41
    6.1  Public Website ..........................................................................  41
    6.2  Admin Dashboard .........................................................................  44
    6.3  Mobile Responsiveness ...................................................................  47

7   Testing ......................................................................................  48
    7.1  Testing Strategy ........................................................................  48
    7.2  Functional Test Cases ...................................................................  48
    7.3  API Testing .............................................................................  51

8   Conclusions and Scope for Future Work ........................................................  52
    8.1  Conclusions .............................................................................  52
    8.2  Scope for Future Work ...................................................................  53

    References ...................................................................................  54
```

---

---

LIST OF ABBREVIATIONS

| Abbreviation | Expanded Form |
|-------------|---------------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| CDN | Content Delivery Network |
| CSS | Cascading Style Sheets |
| DB | Database |
| FK | Foreign Key |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HyperText Transfer Protocol Secure |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MERN | MongoDB, Express.js, React.js, Node.js |
| NGO | Non-Governmental Organization |
| NoSQL | Not Only Structured Query Language |
| ODM | Object Document Mapper |
| OTP | One-Time Password |
| PK | Primary Key |
| REST | Representational State Transfer |
| SDK | Software Development Kit |
| SPA | Single Page Application |
| SRS | Software Requirements Specification |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |

---

---

LIST OF FIGURES

| Figure | Caption | Page |
|--------|---------|------|
| Fig. 4.1 | Three-Tier System Architecture | 16 |
| Fig. 4.2 | DFD Level 0 — Context Diagram | 17 |
| Fig. 4.3 | DFD Level 1 — Process Decomposition | 18 |
| Fig. 4.4 | DFD Level 1 — Mermaid Diagram | 20 |
| Fig. 4.5 | Frontend Component Structure | 21 |
| Fig. 4.6 | Frontend Component Flow Diagram | 23 |
| Fig. 4.7 | Frontend Data Flow | 24 |
| Fig. 4.8 | Frontend Component Tree (Mermaid) | 25 |
| Fig. 4.9 | Backend Directory Structure | 25 |
| Fig. 4.10 | Backend Architecture Flow | 27 |
| Fig. 4.11 | Cloudinary Upload Flow | 28 |
| Fig. 4.12 | Backend Architecture (Mermaid) | 29 |
| Fig. 4.13 | ER Diagram — ASCII Format | 31 |
| Fig. 4.14 | ER Diagram — Mermaid Format | 32 |
| Fig. 4.15 | Full System Architecture (ASCII) | 33 |
| Fig. 4.16 | Full System Architecture (Mermaid) | 34 |
| Fig. 6.1 | Homepage — Desktop View | 41 |
| Fig. 6.2 | Homepage — Mobile View | 41 |
| Fig. 6.3 | Children Section — Card Grid | 42 |
| Fig. 6.4 | Children Section — Filter Panel | 42 |
| Fig. 6.5 | Adoption Application Modal | 42 |
| Fig. 6.6 | Child Sponsorship Modal | 43 |
| Fig. 6.7 | Monetary Donation Section | 43 |
| Fig. 6.8 | Goods Donation Section | 43 |
| Fig. 6.9 | Thank You Confirmation Modal | 43 |
| Fig. 6.10 | Volunteer Registration Form | 44 |
| Fig. 6.11 | Contact Form | 44 |
| Fig. 6.12 | Team Members Section | 44 |
| Fig. 6.13 | Founder Story Section | 44 |
| Fig. 6.14 | User Authentication Dropdown | 44 |
| Fig. 6.15 | Admin Dashboard — Overview Tab | 45 |
| Fig. 6.16 | Admin Dashboard — Children Tab | 45 |
| Fig. 6.17 | Admin Dashboard — Slideshow Tab | 45 |
| Fig. 6.18 | Admin Dashboard — Our Story Tab | 46 |
| Fig. 6.19 | Admin Dashboard — Members Tab | 46 |
| Fig. 6.20 | Admin Dashboard — Donations Tab | 46 |
| Fig. 6.21 | Admin Dashboard — Goods Donations Tab | 46 |
| Fig. 6.22 | Admin Dashboard — Adoptions Tab | 47 |
| Fig. 6.23 | Admin Dashboard — Volunteers Tab | 47 |
| Fig. 6.24 | Admin Dashboard — Messages Tab | 47 |
| Fig. 6.25 | Mobile Navigation Menu | 47 |
| Fig. 6.26 | Mobile Children Section | 47 |
| Fig. 6.27 | Mobile Admin Dashboard | 47 |

---

---

LIST OF TABLES

| Table | Caption | Page |
|-------|---------|------|
| Table 3.1 | FR-01: Child Profile Management Requirements | 7 |
| Table 3.2 | FR-02: Monetary Donation Requirements | 8 |
| Table 3.3 | FR-03: Goods Donation Requirements | 8 |
| Table 3.4 | FR-04: Adoption Application Requirements | 9 |
| Table 3.5 | FR-05: User Authentication Requirements | 9 |
| Table 3.6 | FR-06 to FR-10: Other Functional Requirements | 10 |
| Table 3.7 | Non-Functional Requirements | 11 |
| Table 3.8 | Hardware Requirements | 12 |
| Table 3.9 | Software Requirements | 12 |
| Table 4.1 | DFD Process Descriptions | 19 |
| Table 4.2 | DFD Data Stores | 20 |
| Table 4.3 | REST API Endpoint Reference | 26 |
| Table 4.4 | Entity Attributes — User, Child, Donation | 29 |
| Table 4.5 | Entity Attributes — Adoption, GoodsDonation | 30 |
| Table 4.6 | Entity Attributes — Volunteer, Member, Contact, Slide, FounderStory | 31 |
| Table 4.7 | Entity Relationships Summary | 33 |
| Table 5.1 | Technology Stack Summary | 35 |
| Table 7.1 | Functional Test Cases | 48 |
| Table 7.2 | API Testing Summary | 51 |
| Table 8.1 | Future Enhancements | 53 |

---

---


CHAPTER 1
INTRODUCTION

1.1 Introduction

Non-Governmental Organizations (NGOs) focused on child welfare play a critical role in providing shelter, education, healthcare, and emotional support to orphaned and underprivileged children. Despite their significant social impact, most small to mid-sized NGOs in India continue to rely on manual, paper-based processes for managing their day-to-day operations. This results in inefficiencies, data loss, lack of transparency, and an inability to reach potential donors and volunteers through digital channels.

The rapid growth of web technologies and cloud computing has created an opportunity to address these challenges through purpose-built digital platforms. The MERN stack (MongoDB, Express.js, React.js, Node.js) has emerged as a popular choice for building scalable, full-stack web applications due to its JavaScript-based end-to-end architecture, rich ecosystem, and strong community support [1].

MakeLife is a full-stack web application developed to digitize and streamline the operations of a child welfare NGO. The system provides a public-facing website for donors, volunteers, and adoptive families, alongside a secure administrative dashboard for NGO staff. The application is deployed on cloud platforms — Vercel for the frontend and Railway for the backend — with Cloudinary integrated for persistent image storage.

The system is accessible at: https://makelife-mern-project-w4e9.vercel.app/

1.2 Problem Definition

Child welfare NGOs in India face the following operational challenges:

1. No Centralized Digital System: Most NGOs maintain child records, donation receipts, and adoption files in physical registers or disconnected spreadsheets. This makes retrieval, updating, and sharing of information slow and error-prone.

2. Limited Public Outreach: Without a web presence, NGOs cannot effectively reach potential donors, volunteers, or adoptive families. Donation drives are limited to physical events and word-of-mouth.

3. Image Storage Limitations: When NGOs use basic web hosting, uploaded photographs of children and team members are lost every time the server is redeployed or restarted, as local filesystem storage is ephemeral on modern cloud platforms.

4. No Workflow Management: Adoption applications, goods donation requests, and volunteer registrations are received via email or paper forms with no systematic tracking, status management, or duplicate prevention.

5. Security Concerns: User credentials stored in plain text and lack of token-based authentication expose sensitive data to security risks.

MakeLife addresses all of the above by providing a unified, secure, cloud-deployed platform with persistent image storage, JWT authentication, and comprehensive workflow management.

1.3 Objectives

The primary objectives of this project are:

1. To develop a full-stack MERN web application for NGO operations management
2. To provide a public-facing website for donors, volunteers, and adoptive families
3. To build a secure admin dashboard with complete CRUD management across all modules
4. To integrate Cloudinary for persistent cloud-based image storage
5. To implement JWT-based authentication with bcrypt password hashing
6. To deploy the application on cloud platforms (Vercel + Railway) for 24/7 availability
7. To ensure full mobile responsiveness across all device sizes
8. To implement workflow management for adoptions, goods donations, and volunteers

1.4 Outline of the Report

The remainder of this report is organized as follows:

Chapter 2 presents a literature review of existing NGO management systems, reference NGOs, and the justification for the proposed solution.
Chapter 3 defines the system requirements including functional requirements, non-functional requirements, hardware/software requirements, and use case descriptions.
Chapter 4 covers the complete system design including the three-tier architecture, Data Flow Diagrams (Level 0 and Level 1), frontend architecture, backend architecture, and Entity Relationship Diagram.
Chapter 5 describes the implementation details including the technology stack, module-wise implementation, authentication, and Cloudinary integration.
Chapter 6 presents screenshots of the deployed application covering all public sections and admin dashboard tabs.
Chapter 7 presents the testing strategy, functional test cases, and API testing results.
Chapter 8 concludes the report and discusses scope for future work.

---

CHAPTER 2
LITERATURE REVIEW

2.1 Existing NGO Management Systems

Several software solutions exist for NGO and non-profit management. A review of the most prominent systems reveals significant gaps when applied to child welfare organizations in India.

Salesforce Nonprofit Success Pack (NPSP) [2] is a widely used CRM platform adapted for non-profits. It provides donor management, campaign tracking, and reporting. However, it is expensive (enterprise licensing), requires significant customization, and does not include domain-specific workflows for child adoption, goods donations, or volunteer management.

Bloomerang [3] is a donor management platform focused on donor retention analytics. While effective for tracking monetary donations, it lacks modules for adoption management, goods donations, volunteer registration, or child profile management.

Apricot by Bonterra [4] offers case management and outcomes tracking for social service organizations. It is designed for enterprise-level organizations with dedicated IT staff and carries a high licensing cost that is prohibitive for small NGOs.

Generic Content Management Systems (CMS) such as WordPress with donation plugins provide basic web presence but require heavy customization for domain-specific workflows and do not offer integrated admin dashboards for managing adoptions or volunteers.

Manual Spreadsheets and Paper Records remain the most common approach for small NGOs in India. While familiar and low-cost, they offer no real-time access, are prone to data loss, cannot support public-facing donation or adoption workflows, and provide no security for sensitive child data.

Table 2.1 presents a comparative analysis of existing systems against MakeLife.

Table 2.1: Comparison of Existing Systems with MakeLife

| Feature | Salesforce NPSP | Bloomerang | Manual Records | MakeLife |
|---------|----------------|------------|----------------|---------|
| Child profile management | Partial | No | Manual | Full CRUD + Cloudinary |
| Monetary donations | Yes | Yes | Manual | General + Sponsorship |
| Goods donations | No | No | Manual | 8-category system |
| Adoption management | No | No | Manual | Full workflow |
| Volunteer management | No | No | Manual | Registration + tracking |
| Public-facing website | Separate | No | No | Integrated SPA |
| Cloud image storage | Varies | No | No | Cloudinary |
| Mobile responsive | Varies | Yes | N/A | Mobile-first |
| JWT Authentication | Yes | Yes | No | bcrypt + JWT |
| Cost | High | High | Low | Free/low-cost |
| India-specific | No | No | Yes | INR, Indian phone format |

2.2 Reference NGOs and Orphanages

The following real-world NGOs and orphanages were studied to understand operational requirements and inform the design of MakeLife:

1. SOS Children's Villages India [5]
SOS Children's Villages is one of the largest child welfare organizations in India, operating in over 32 locations. Their digital platform (www.soschildrensvillages.in) provides online donation processing, child sponsorship programs, and volunteer registration. The MakeLife child sponsorship module and donation tracking system were inspired by their model of linking donors directly to specific children.

2. Udayan Care [6]
Udayan Care (www.udayancare.org) is a Delhi-based NGO that provides family-based care for orphaned children. Their adoption facilitation process, which involves detailed applicant screening including income verification and family size assessment, directly informed the design of MakeLife's adoption application form (annual income, family members, reason fields).

3. CRY — Child Rights and You [7]
CRY (www.cry.org) is a prominent Indian NGO focused on child rights. Their online platform demonstrates effective use of digital tools for donor engagement, goods collection drives, and volunteer coordination. The MakeLife goods donation module's multi-category approach (food, clothing, books, toys, hygiene items) was modeled after CRY's in-kind donation campaigns.

4. Smile Foundation [8]
Smile Foundation (www.smilefoundation.in) operates child welfare programs across India. Their volunteer management system, which tracks volunteer availability, areas of interest, and skills, informed the design of MakeLife's volunteer registration form (availability, areas[], occupation fields).

5. Bal Asha Trust, Mumbai [9]
Bal Asha Trust is a Mumbai-based adoption agency and child welfare organization. Their adoption process requirements — including home study, income verification, and family background checks — validated the fields included in MakeLife's adoption application (address, annualIncome, familyMembers, reason).

6. Missionaries of Charity (Mother Teresa's Organization) [10]
The Missionaries of Charity operate orphanages and child care homes across India. Their model of accepting goods donations (food, clothing, blankets, hygiene items) directly informed the category design of MakeLife's goods donation system.

2.3 Limitations of Existing Systems

Based on the review above, the following limitations were identified in existing solutions:

1. No single platform integrates child profiles, monetary donations, goods donations, adoption management, and volunteer management in one system
2. Existing platforms are either too expensive for small NGOs or too generic to support domain-specific workflows
3. Image storage on basic hosting is ephemeral — photos are lost on server restart
4. No duplicate prevention for adoption applications
5. No mobile-first responsive design tailored for Indian users
6. No support for Indian currency (INR) and Indian phone number format (10 digits)

2.4 Proposed Solution

MakeLife addresses all identified limitations by providing a purpose-built, cloud-deployed MERN stack application with:
- Integrated management of all NGO workflows in a single platform
- Cloudinary for permanent image storage
- JWT + bcrypt for secure authentication
- Duplicate adoption prevention at the database level
- Mobile-first responsive design
- INR currency support and 10-digit phone validation
- Free-tier cloud deployment (Vercel + Railway) making it accessible to small NGOs

---

CHAPTER 3
SYSTEM REQUIREMENTS

3.1 Functional Requirements

FR-01: Child Profile Management

Table 3.1: FR-01 — Child Profile Management

| ID | Requirement |
|----|-------------|
| FR-01a | The system shall allow administrators to add a new child profile |
| FR-01b | Each child profile shall include: name, age, gender (Boy/Girl), story, and a photo |
| FR-01c | The system shall display all child profiles in a responsive card-based grid layout |
| FR-01d | The system shall allow administrators to delete a child profile |
| FR-01e | The system shall allow administrators to edit a child profile |
| FR-01f | The system shall support photo upload (JPG/PNG) stored permanently on Cloudinary |
| FR-01g | The system shall support filtering children by age range and gender |
| FR-01h | If the backend is unavailable, the system shall display fallback mock data |

FR-02: Monetary Donation Management

Table 3.2: FR-02 — Monetary Donation Management

| ID | Requirement |
|----|-------------|
| FR-02a | The system shall allow authenticated users to make a monetary donation |
| FR-02b | The system shall record donor name, email, phone, and donation amount |
| FR-02c | The system shall allow donors to sponsor a specific child |
| FR-02d | Sponsorship donations shall be linked to the child's ID and name in the database |
| FR-02e | The system shall display a thank-you modal after a successful donation |
| FR-02f | All donations shall be persisted in MongoDB |
| FR-02g | The system shall classify donations as 'general' or 'sponsorship' |
| FR-02h | The homepage shall display total funds raised and donor count, refreshing every 30 seconds |

FR-03: Goods Donation Management

Table 3.3: FR-03 — Goods Donation Management

| ID | Requirement |
|----|-------------|
| FR-03a | The system shall allow authenticated users to submit goods donation requests |
| FR-03b | The system shall support 8 categories: food, clothing, books, toys, hygiene, blankets, stationery, footwear |
| FR-03c | The system shall capture category-specific details for each goods type |
| FR-03d | The system shall allow admins to approve or reject goods donation requests |
| FR-03e | All goods donations shall be stored with 'pending' status by default |

FR-04: Adoption Application

Table 3.4: FR-04 — Adoption Application

| ID | Requirement |
|----|-------------|
| FR-04a | The system shall allow authenticated users to submit an adoption application |
| FR-04b | The form shall collect: applicant name, address, annual income, family members, phone, email, reason |
| FR-04c | The system shall validate all required fields before submission |
| FR-04d | The system shall prevent duplicate pending applications for the same child by the same email |
| FR-04e | The system shall display a success confirmation upon submission |
| FR-04f | Adoption applications shall be stored with 'pending' status by default |
| FR-04g | Admins shall be able to approve or reject applications via PATCH API |

FR-05: User Authentication

Table 3.5: FR-05 — User Authentication

| ID | Requirement |
|----|-------------|
| FR-05a | The system shall allow users to register with full name, email, and password |
| FR-05b | Passwords shall be hashed using bcryptjs (10 salt rounds) before storage |
| FR-05c | The system shall issue a JWT token (7-day expiry) upon successful login |
| FR-05d | The system shall allow registered users to log in via email and password |
| FR-05e | The system shall prevent duplicate registrations with the same email (409 response) |
| FR-05f | Admin login shall use environment-variable-based credentials |
| FR-05g | Authentication token shall be stored in localStorage and sent via Authorization header |

FR-06 to FR-10: Additional Functional Requirements

Table 3.6: FR-06 to FR-10 — Additional Requirements

| ID | Module | Requirement |
|----|--------|-------------|
| FR-06a | Volunteer | The system shall allow any visitor to register as a volunteer |
| FR-06b | Volunteer | Form shall collect: name, email, phone, age, occupation, availability, areas, motivation |
| FR-06c | Volunteer | Admins shall update volunteer status and delete records |
| FR-07a | Members | Admins shall add team member profiles with Cloudinary photo upload |
| FR-07b | Members | Team members shall be displayed publicly on the About/Team page |
| FR-07c | Members | Phone number field shall be limited to 10 digits |
| FR-08a | Contact | Any visitor shall submit a contact inquiry (name, email, phone, message) |
| FR-08b | Contact | Admins shall view and delete contact messages |
| FR-09a | Upload | System shall accept JPG/JPEG/PNG uploads stored on Cloudinary |
| FR-09b | Upload | File size shall be limited to 5MB per upload |
| FR-10a | UI/UX | Sticky navigation bar with section links |
| FR-10b | UI/UX | Fully responsive: mobile (< 640px), tablet (< 1024px), desktop |
| FR-10c | UI/UX | Phone number fields limited to 10 digits (digits only) |
| FR-10d | UI/UX | Slideshow: 240px (mobile), 340px (tablet), 480px (desktop) |

3.2 Non-Functional Requirements

Table 3.7: Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Frontend loads within 3 seconds on broadband |
| NFR-02 | Performance | API responses returned within 2 seconds under normal load |
| NFR-03 | Performance | Donation statistics auto-refresh every 30 seconds |
| NFR-04 | Security | Passwords hashed using bcryptjs (10 salt rounds) |
| NFR-05 | Security | JWT tokens with 7-day expiry |
| NFR-06 | Security | Admin credentials via environment variables |
| NFR-07 | Security | File uploads restricted to image formats only |
| NFR-08 | Usability | Intuitive UI accessible to non-technical users |
| NFR-09 | Usability | Descriptive error messages on all forms |
| NFR-10 | Usability | Touch/swipe support on slideshow |
| NFR-11 | Reliability | Fallback mock data when backend is unreachable |
| NFR-12 | Reliability | Global error handler returns JSON errors |
| NFR-13 | Reliability | Duplicate adoption prevention at database level |
| NFR-14 | Maintainability | Modular route/model architecture |
| NFR-15 | Maintainability | Environment config via .env files |
| NFR-16 | Scalability | Stateless REST API for horizontal scaling |
| NFR-17 | Scalability | Cloudinary eliminates server filesystem dependency |

3.3 Hardware Requirements

Table 3.8: Hardware Requirements

| Component | Minimum Specification |
|-----------|----------------------|
| Processor | Intel Core i3 or equivalent |
| RAM | 4 GB |
| Storage | 10 GB free disk space |
| Internet | Broadband connection (for cloud services) |
| Display | Any modern display (responsive design) |

3.4 Software Requirements

Table 3.9: Software Requirements

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend Framework | React.js | 18+ |
| Backend Runtime | Node.js | 18+ |
| Backend Framework | Express.js | 4.18.x |
| Database | MongoDB Atlas | 6+ |
| ODM | Mongoose | 7.6.x |
| Authentication | bcryptjs + jsonwebtoken | 2.4.x / 9.x |
| File Upload | multer + multer-storage-cloudinary | 2.x / 4.x |
| Image Storage | Cloudinary SDK | 1.x |
| Frontend Deployment | Vercel | Latest |
| Backend Deployment | Railway | Latest |
| Version Control | Git + GitHub | Latest |
| Browser | Chrome / Firefox / Edge / Safari | Latest |

3.5 Use Case Descriptions

UC-01: Add Child Profile

| Field | Detail |
|-------|--------|
| Use Case ID | UC-01 |
| Actor | Administrator |
| Precondition | Administrator is authenticated and on the Children tab |
| Main Flow | 1. Click "Add Child" -> 2. Fill form (name, age, gender, story) -> 3. Select photo from device -> 4. Submit -> 5. Photo uploads to Cloudinary -> 6. Profile saved to MongoDB -> 7. New card appears in grid |
| Postcondition | New child card appears in admin grid and public children section |
| Exception | If required fields are missing, validation error is shown |

UC-02: Make a Monetary Donation

| Field | Detail |
|-------|--------|
| Use Case ID | UC-02 |
| Actor | Registered User |
| Precondition | User is logged in |
| Main Flow | 1. Navigate to Donate section -> 2. Select preset amount (Rs.200/Rs.750/Rs.1500/Rs.5000) or custom -> 3. Enter donor name, email, phone -> 4. Click "Donate Now" -> 5. POST /api/donations -> 6. Thank-you modal shown |
| Postcondition | Donation record saved; homepage statistics updated |
| Exception | If name is empty, alert prompts user before submission |

UC-03: Submit Adoption Application

| Field | Detail |
|-------|--------|
| Use Case ID | UC-03 |
| Actor | Registered User |
| Precondition | User is logged in; child profile exists |
| Main Flow | 1. Click "Adopt" on child card -> 2. Fill adoption form -> 3. Submit -> 4. System checks for duplicate pending application -> 5. Application saved as 'pending' |
| Postcondition | Application stored in MongoDB; visible in admin Adoptions tab |
| Exception | Duplicate pending application returns HTTP 409 with descriptive message |

UC-04: Register as Volunteer

| Field | Detail |
|-------|--------|
| Use Case ID | UC-04 |
| Actor | Any Visitor (no login required) |
| Main Flow | 1. Navigate to Volunteer section -> 2. Fill form (name, email, motivation, areas) -> 3. Submit -> 4. POST /api/volunteers -> 5. Record saved as 'pending' |
| Postcondition | Volunteer record visible in admin Volunteers tab |

UC-05: Admin Reviews Adoption Application

| Field | Detail |
|-------|--------|
| Use Case ID | UC-05 |
| Actor | Administrator |
| Precondition | Admin authenticated via /api/auth/admin/signin |
| Main Flow | 1. Open Adoptions tab -> 2. View pending applications -> 3. Click Approve or Reject -> 4. PATCH /api/adoptions/:id/status -> 5. Status updated in MongoDB |
| Postcondition | Application status updated to 'approved' or 'rejected' |

UC-06: Upload Slideshow Photo

| Field | Detail |
|-------|--------|
| Use Case ID | UC-06 |
| Actor | Administrator |
| Main Flow | 1. Open Slideshow tab -> 2. Click upload zone or drag photo -> 3. File sent as multipart to POST /api/slides -> 4. Cloudinary stores image -> 5. Permanent URL saved to MongoDB -> 6. Photo appears in homepage carousel |
| Postcondition | Photo persists permanently on Cloudinary |

UC-07: Submit Goods Donation

| Field | Detail |
|-------|--------|
| Use Case ID | UC-07 |
| Actor | Registered User |
| Precondition | User is logged in |
| Main Flow | 1. Navigate to Donate -> Goods tab -> 2. Select category -> 3. Fill category-specific details -> 4. Enter contact and address -> 5. Submit -> 6. POST /api/goods-donation -> 7. Saved as 'pending' |
| Postcondition | Goods donation record saved; admin can approve/reject |

---

CHAPTER 4
SYSTEM DESIGN

4.1 System Architecture

MakeLife follows a 3-Tier Client-Server Architecture with cloud services as shown in Fig. 4.1.

| Tier | Technology | Hosting | Responsibility |
|------|-----------|---------|----------------|
| Presentation Tier | React.js SPA | Vercel | UI rendering, user interaction, API calls |
| Application Tier | Node.js + Express.js | Railway | Business logic, routing, file handling |
| Data Tier | MongoDB Atlas + Cloudinary | Cloud | Data persistence, image storage |

```
╔══════════════════════════════════════════════════════════════╗
║           PRESENTATION TIER — Vercel (CDN)                  ║
║   React.js SPA: Public Website + Admin Dashboard            ║
╚══════════════════════════╦═══════════════════════════════════╝
                           ║ HTTPS REST API (JSON)
╔══════════════════════════╩═══════════════════════════════════╗
║           APPLICATION TIER — Railway                        ║
║   Node.js + Express.js: Routes, Models, Middleware          ║
╚══════════════╦═══════════════════════════╦═══════════════════╝
               ║ Mongoose ODM              ║ multer-storage-cloudinary
╔══════════════╩══════════╗  ╔═════════════╩═══════════════════╗
║  MongoDB Atlas          ║  ║  Cloudinary                     ║
║  (NoSQL Database)       ║  ║  (Image Storage)                ║
╚═════════════════════════╝  ╚═════════════════════════════════╝
```

Fig. 4.1: Three-Tier System Architecture

4.2 Data Flow Diagram — Level 0 (Context Diagram)

The Context Diagram (Fig. 4.2) represents the entire MakeLife system as a single process, showing all external entities and the data flowing in and out.

```
                    +------------------------------------------+
                    |                                          |
+----------------+  |                                          |  +----------------+
| Registered     |->|  Registration, Login, Donation Data,    |->| MongoDB Atlas  |
| User           |<-|  Goods Form, Adoption, Volunteer Form   |<-| (Database)     |
+----------------+  |                                          |  +----------------+
                    |       M A K E L I F E  SYSTEM           |
+----------------+  |  (React SPA + Node/Express REST API)    |  +----------------+
| Public Visitor |->|                                          |->| Cloudinary     |
|                |<-|  Child Profiles, Team Info, Slideshow   |<-| (Image Store)  |
+----------------+  |                                          |  +----------------+
                    |                                          |
+----------------+  |                                          |
| Administrator  |->|  Admin Credentials, CRUD Operations,    |
|                |<-|  Status Updates, Photo Uploads          |
+----------------+  +------------------------------------------+
```

Fig. 4.2: DFD Level 0 — Context Diagram

External Entities: (1) Registered User — authenticated user who donates, applies for adoption, or volunteers; (2) Public Visitor — unauthenticated user who browses children and submits contact; (3) Administrator — NGO staff managing all records; (4) MongoDB Atlas — persistent cloud data store; (5) Cloudinary — cloud image storage.

4.3 Data Flow Diagram — Level 1

The Level 1 DFD (Fig. 4.3) decomposes the MakeLife system into its 10 major functional processes.

```
REGISTERED USER / PUBLIC VISITOR
+----------+
|          |--[Browse Children]-----> P1: Child Profile Mgmt <---> DS1: children
|          |<-[Child Cards]--------
|          |--[Donate Money]-------> P2: Donation Processing <---> DS2: donations
|          |<-[Confirmation]-------
|          |--[Donate Goods]-------> P3: Goods Donation Mgmt <---> DS3: goodsdonations
|          |<-[Status]-------------
|          |--[Adoption Form]------> P4: Adoption Management <---> DS4: adoptions
|          |<-[Success/Error]------
|          |--[Volunteer Form]-----> P5: Volunteer Management <--> DS5: volunteers
|          |<-[Confirmation]-------
|          |--[Contact Form]-------> P6: Contact Handling <-----> DS6: contacts
|          |<-[Confirmation]-------
|          |--[Register/Login]-----> P7: Auth & Authorization <--> DS7: users
|          |<-[JWT Token]----------
+----------+

ADMINISTRATOR
+----------+
|          |--[Login]-------------> P7: Auth & Authorization
|          |--[Member Data/Photo]-> P8: Team Member Mgmt <-------> DS8: members
|          |--[Slideshow Photo]---> P9: Slideshow Management <---> DS9: slides
|          |--[Story Data/Photo]--> P10: Founder Story Mgmt <----> DS10: founderstories
|          |--[Approve/Reject]----> P4: Adoption Management (status update)
|          |--[Approve/Reject]----> P3: Goods Donation Mgmt (status update)
|          |--[Status Update]-----> P5: Volunteer Management (status update)
+----------+

P1, P8, P9, P10 ----> Cloudinary API ----> Permanent HTTPS URL ----> MongoDB
```

Fig. 4.3: DFD Level 1 — Process Decomposition

Table 4.1: DFD Process Descriptions

| ID | Process | Input | Output | Data Store |
|----|---------|-------|--------|-----------|
| P1 | Child Profile Management | Child data + photo file | Child card with Cloudinary URL | DS1: children |
| P2 | Donation Processing | Donor info + amount + optional childId | Donation record + stats | DS2: donations |
| P3 | Goods Donation Management | Goods form + category details | Goods record (pending) | DS3: goodsdonations |
| P4 | Adoption Management | Applicant details + childId | Application (pending/approved/rejected) | DS4: adoptions |
| P5 | Volunteer Management | Volunteer form data | Volunteer record (pending) | DS5: volunteers |
| P6 | Contact Handling | Name, email, phone, message | Contact record | DS6: contacts |
| P7 | Auth & Authorization | Email + password | JWT token | DS7: users |
| P8 | Team Member Management | Member data + photo | Member profile with Cloudinary URL | DS8: members |
| P9 | Slideshow Management | Photo file | Slide with Cloudinary URL | DS9: slides |
| P10 | Founder Story Management | Story text + photo | Founder story document | DS10: founderstories |

Table 4.2: DFD Data Stores

| Store | Collection | Key Fields |
|-------|-----------|-----------|
| DS1 | children | name, age, gender, story, photo (Cloudinary URL) |
| DS2 | donations | donorName, amount, donationType, childId (FK), donorEmail, donorPhone |
| DS3 | goodsdonations | donorName, items, 20+ category fields, status |
| DS4 | adoptions | childId (FK), applicantName, email, phone, annualIncome, status |
| DS5 | volunteers | fullName, email, areas[], availability, motivation, status |
| DS6 | contacts | name, email, phone, message, submittedAt |
| DS7 | users | fullName, email, password (bcrypt hashed) |
| DS8 | members | name, role, bio, photo (Cloudinary URL), email, phone |
| DS9 | slides | url (Cloudinary URL), order, createdAt |
| DS10 | founderstories | founderName, founderRole, founderBio, founderPhoto, story1/2/3 |

4.4 Frontend Architecture

4.4.1 Component Structure

The entire frontend is a React.js Single Page Application (SPA) contained in App.js. Navigation is state-driven — the activeSection state controls which public page renders, and the view state in AppRoot controls whether the public site, admin login, or admin dashboard is shown.

```
frontend_backup/src/
  index.js          <- React DOM entry point
  App.js            <- All components in one file

  AppRoot           <- Root: view = 'app' | 'admin-auth' | 'admin-dash'
    |
    +-- OrphanageWebsite (Public Site)
    |     activeSection: home | children | donate | volunteer | contact | about
    |     Sections: Home, Children, Donate, Volunteer, Contact, About/Team
    |     Modals: NavLoginDropdown, LoginGateModal, ForgotPasswordModal,
    |             DonationModal, SponsorModal, CustomAmountModal,
    |             AdoptionModal, GoodsDonationModal, ThankYouModal
    |     Shared: HomeSlideshow (responsive), FloatingHearts
    |
    +-- AdminLoginPage (Admin Auth)
    |
    +-- AdminDashboard (Admin Panel)
          Tabs (11): Overview, Slideshow, Our Story, Children, Members,
                     Money Donations, Goods Donations, Adoptions,
                     Messages, Volunteers, Vol. Profiles
```

Fig. 4.5: Frontend Component Structure

4.4.2 Component Flow Diagram

```
index.js --> AppRoot (view state)
                |
    +-----------+-------------+
    |           |             |
    v           v             v
OrphanageWebsite  AdminLoginPage  AdminDashboard
    |                             |
    +-- Home                      +-- Overview (KPI stats)
    |     +-- HomeSlideshow        +-- Slideshow (upload/manage)
    |     +-- Stats Display        +-- Our Story (founder bio)
    |                              +-- Children (CRUD + photo)
    +-- Children                   +-- Members (CRUD + photo)
    |     +-- Filter Panel         +-- Money Donations (view)
    |     +-- Child Cards          +-- Goods Donations (approve/reject)
    |     +-- AdoptionModal        +-- Adoptions (approve/reject)
    |     +-- SponsorModal         +-- Messages (view/delete)
    |                              +-- Volunteers (status/delete)
    +-- Donate                     +-- Vol. Profiles (manage)
    |     +-- Money Tab
    |     |     +-- DonationModal
    |     |     +-- ThankYouModal
    |     +-- Goods Tab
    |           +-- GoodsDonationModal
    |
    +-- Volunteer --> POST /api/volunteers
    +-- Contact   --> POST /api/contact
    +-- About     --> GET /api/members, /api/founder-story
```

Fig. 4.6: Frontend Component Flow Diagram

4.4.3 Frontend Data Flow

```
App Mounts (useEffect)
    |
    +-> GET /api/children       -> setChildren([...])
    +-> GET /api/donations      -> setDonations([...]) -> totalRaised, donorCount
    +-> GET /api/members        -> setMembers([...])
    +-> GET /api/slides         -> setHomepageSlides([...])
    +-> GET /api/founder-story  -> setFounderStoryData({...})
                                        |
                                        v
                                 UI Renders with data

User: "Donate" -> DonationModal -> POST /api/donations -> ThankYouModal
User: "Adopt"  -> requireLogin() -> AdoptionModal -> POST /api/adoptions
Admin: Upload  -> <label><input file> -> POST /api/slides -> Cloudinary -> URL saved
```

Fig. 4.7: Frontend Data Flow

4.5 Backend Architecture

4.5.1 Directory Structure

```
backend/
  server.js                 <- Entry point
  .env                      <- MONGO_URI, Cloudinary keys, JWT_SECRET
  config/cloudinary.js      <- Cloudinary + multer-storage-cloudinary
  models/
    User.js, Child.js, Donation.js, GoodsDonation.js
    Adoption.js, Member.js, Contact.js
  routes/
    authRoutes.js, childRoutes.js, donationRoutes.js
    goodsDonationRoutes.js, adoptionRoutes.js, volunteerRoutes.js
    memberRoutes.js, contactRoutes.js, slidesRoutes.js
    founderStoryRoutes.js, uploadRoutes.js
```

Fig. 4.9: Backend Directory Structure

Note: volunteerRoutes.js, slidesRoutes.js, and founderStoryRoutes.js define their Mongoose schemas inline (no separate model files).

4.5.2 API Endpoint Reference

Table 4.3: REST API Endpoint Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user (bcrypt + JWT) |
| POST | /api/auth/signin | User login (bcrypt verify + JWT) |
| POST | /api/auth/admin/signin | Admin login (env credentials) |
| GET | /api/children | Fetch all children |
| POST | /api/children | Add child with Cloudinary photo |
| PUT | /api/children/:id | Update child |
| DELETE | /api/children/:id | Delete child |
| GET | /api/donations | Fetch all donations |
| POST | /api/donations | Create donation (general or sponsorship) |
| GET | /api/goods-donation | Fetch all goods donations |
| POST | /api/goods-donation | Submit goods donation |
| PATCH | /api/goods-donation/:id | Update status (admin) |
| GET | /api/adoptions | Fetch all applications |
| POST | /api/adoptions | Submit application (duplicate check) |
| PATCH | /api/adoptions/:id/status | Update status (admin) |
| DELETE | /api/adoptions/:id | Delete application |
| GET | /api/volunteers | Fetch all volunteers |
| POST | /api/volunteers | Register volunteer |
| PATCH | /api/volunteers/:id | Update status |
| DELETE | /api/volunteers/:id | Delete volunteer |
| GET | /api/members | Fetch all members |
| POST | /api/members | Add member (Cloudinary photo) |
| PUT | /api/members/:id | Update member |
| DELETE | /api/members/:id | Delete member |
| GET/POST/DELETE | /api/slides | Slideshow management (Cloudinary) |
| GET/PUT/POST | /api/founder-story | Founder story (Cloudinary) |
| GET/POST/DELETE | /api/contact | Contact messages |
| POST | /api/upload | General Cloudinary upload |

4.5.3 Backend Architecture Flow

```
HTTP Request (React Frontend on Vercel)
            |
            v
    +------------------+
    |    server.js     |
    | cors()           |
    | express.json()   |
    | urlencoded()     |
    | logger           |
    +--------+---------+
             | Route matching
    +--------+--------+--------+--------+--------+
    |        |        |        |        |        |
  /auth /children /donations /adoptions /members /slides ...
    |        |        |        |        |        |
  authR.  childR.  donR.  adoptR.  memberR. slidesR.
    |        |        |        |        |        |
  User    Child   Donation Adoption  Member   Slide
  Model   Model   Model    Model     Model   (inline)
    |        +--------+--------+--------+--------+
    |                          |
    |                    Cloudinary (photo uploads)
    |                          |
    +--------+-----------------+
             |
         MongoDB Atlas
```

Fig. 4.10: Backend Architecture Flow

4.5.4 Cloudinary Upload Flow

```
Admin selects photo (file picker: <label><input type="file">)
    |
    v
FormData with photo file
    |
    v
POST /api/children (or /members, /slides, /founder-story)
    |
    v
multer-storage-cloudinary intercepts file
    |
    v
Cloudinary API (cloud_name, api_key, api_secret)
    |
    v
Image stored: https://res.cloudinary.com/{cloud}/image/upload/makelife/{folder}/{id}.jpg
    |
    v
req.file.path = permanent Cloudinary URL
    |
    v
URL saved to MongoDB document (photo field)
    |
    v
Image loads on all devices, persists across redeployments
```

Fig. 4.11: Cloudinary Upload Flow

4.6 Entity Relationship Diagram

4.6.1 Entity Attributes

Table 4.4: Entity Attributes — User, Child, Donation

| Entity | Attribute | Type | Constraint |
|--------|-----------|------|-----------|
| USER | _id | ObjectId | PK (auto) |
| | fullName | String | Optional |
| | email | String | Required, Unique |
| | password | String | Required, bcrypt hashed |
| | createdAt | Date | Auto |
| CHILD | _id | ObjectId | PK (auto) |
| | name | String | Required |
| | age | Number | Required |
| | gender | String | Enum: Boy/Girl |
| | story | String | Optional |
| | photo | String | Cloudinary URL |
| DONATION | _id | ObjectId | PK (auto) |
| | donorName | String | Default: Anonymous |
| | amount | Number | Required |
| | donorEmail | String | Optional |
| | donorPhone | String | Optional, max 10 digits |
| | donationType | String | Enum: general/sponsorship |
| | childId | ObjectId | FK -> Child._id (optional) |
| | childName | String | Denormalized |
| | createdAt | Date | Default: now |

Table 4.5: Entity Attributes — Adoption, GoodsDonation

| Entity | Attribute | Type | Constraint |
|--------|-----------|------|-----------|
| ADOPTION | _id | ObjectId | PK (auto) |
| | childId | String | References Child._id |
| | childName | String | Required |
| | applicantName | String | Required |
| | address | String | Required |
| | annualIncome | Number | Required |
| | familyMembers | Number | Required |
| | phone | String | Required |
| | email | String | Required |
| | reason | String | Required |
| | status | String | Enum: pending/approved/rejected |
| | submittedAt | Date | Default: now |
| GOODSDONATION | _id | ObjectId | PK (auto) |
| | donorName | String | Required |
| | email, phone | String | Optional |
| | items | String | Required (category) |
| | address, pincode, state | String | Optional |
| | [20+ category fields] | String | Food/Clothing/Books/Toys/etc. |
| | status | String | Enum: pending/approved/rejected |
| | createdAt | Date | Default: now |

Table 4.6: Entity Attributes — Volunteer, Member, Contact, Slide, FounderStory

| Entity | Key Attributes | Notes |
|--------|---------------|-------|
| VOLUNTEER | fullName, email, phone, age, occupation, availability, areas[], motivation, status | Inline schema in volunteerRoutes.js |
| MEMBER | name, role, bio, photo (Cloudinary), email, phone (max 10 digits), joinedYear | Separate Member.js model |
| CONTACT | name, email, phone, message, submittedAt | Standalone, no FK |
| SLIDE | url (Cloudinary URL), order, createdAt | Inline schema in slidesRoutes.js |
| FOUNDERSTORY | founderName, founderRole, founderBio, founderPhoto, story1, story2, story3 | Singleton document |

4.6.2 ER Diagram — ASCII Format

```
+-------------+              +----------------------------------+
|    USER     |              |            CHILD                 |
+-------------+              +----------------------------------+
| PK _id      |              | PK _id                           |
|    fullName |              |    name, age, gender             |
|    email    |              |    story                         |
|    password |              |    photo (Cloudinary URL)        |
+------+------+              +----------+-------------------+---+
       |                                |                   |
       | submits                   1    |              1    |
       |                               |                   |
  0..*  |                         0.*  |             0.*   |
       v                               v                   v
+------------------+        +------------------+  +------------------+
|    ADOPTION      |        |    DONATION      |  |  GOODSDONATION   |
+------------------+        +------------------+  +------------------+
| PK _id           |        | PK _id           |  | PK _id           |
| FK childId ------+->CHILD | FK childId ------+->CHILD (optional)  |
|    applicantName |        |    donorName     |  |    donorName     |
|    address       |        |    amount        |  |    items         |
|    annualIncome  |        |    donationType  |  |    status        |
|    status        |        |    createdAt     |  |    createdAt     |
+------------------+        +------------------+  +------------------+

+------------------+  +------------------+  +------------------+
|    VOLUNTEER     |  |     MEMBER       |  |    CONTACT       |
+------------------+  +------------------+  +------------------+
| PK _id           |  | PK _id           |  | PK _id           |
|    fullName      |  |    name, role    |  |    name, email   |
|    email         |  |    bio, photo    |  |    phone         |
|    areas[]       |  |    email, phone  |  |    message       |
|    motivation    |  |    joinedYear    |  |    submittedAt   |
|    status        |  |    createdAt     |  +------------------+
+------------------+  +------------------+  (standalone)
(standalone)          (standalone)

+------------------+  +------------------+
|     SLIDE        |  |  FOUNDERSTORY    |
+------------------+  +------------------+
| PK _id           |  | PK _id           |
|    url (CLD URL) |  |    founderName   |
|    order         |  |    founderBio    |
|    createdAt     |  |    founderPhoto  |
+------------------+  |    story1/2/3    |
(standalone)          +------------------+
                      (singleton)
```

Fig. 4.13: ER Diagram — ASCII Format

4.7 Database Schema Design

Table 4.7: Entity Relationships Summary

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| User -> Donation | 1 to Many | A user can make multiple donations |
| User -> Adoption | 1 to Many | A user can submit multiple adoption applications |
| User -> GoodsDonation | 1 to Many | A user can submit multiple goods donations |
| User -> Volunteer | 1 to 1 | A user registers once as a volunteer |
| Child -> Donation | 1 to Many | A child can be sponsored by multiple donors |
| Child -> Adoption | 1 to Many | A child can have multiple adoption applications |
| Member, Contact, Slide, FounderStory | Independent | No FK relationships |

---

CHAPTER 5
IMPLEMENTATION

5.1 Technology Stack

The MakeLife application is built on the MERN stack, which uses JavaScript across all layers of the system. This choice was deliberate — a single language across frontend, backend, and database tooling reduces context-switching for developers and allows code and data structures to be shared more easily between layers. The frontend is a React.js single-page application, the backend is a Node.js server running Express.js, and all data is stored in a MongoDB Atlas cloud database accessed through the Mongoose ODM. Image storage is handled by Cloudinary, which provides a permanent, CDN-backed URL for every uploaded file. Table 5.1 summarizes the full technology stack.

Table 5.1: Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React.js | 18+ | SPA UI framework |
| Backend | Node.js + Express.js | 18+ / 4.18.x | REST API server |
| Database | MongoDB Atlas | 6+ | NoSQL cloud database |
| ODM | Mongoose | 7.6.x | Schema modeling |
| Auth | bcryptjs + jsonwebtoken | 2.4.x / 9.x | Password hashing + JWT |
| File Upload | multer + multer-storage-cloudinary | 2.x / 4.x | Image upload pipeline |
| Image Storage | Cloudinary SDK | 1.x | Persistent cloud image storage |
| Frontend Deploy | Vercel | Latest | CDN-based SPA hosting |
| Backend Deploy | Railway | Latest | Node.js cloud hosting |
| Version Control | Git + GitHub | Latest | Source control |

5.2 Frontend Implementation

The entire frontend of MakeLife is contained within a single App.js file. Rather than splitting the application into separate component files, all React components — from the public homepage to the admin dashboard — are defined and composed within this one file. This approach was chosen to keep the project self-contained and easy to deploy, since Vercel only needs to build a single React application entry point. State management is handled entirely through React's built-in hooks: useState manages UI state such as the active section, modal visibility, and form data, while useEffect handles data fetching on component mount and sets up the 30-second polling interval for donation statistics.

Navigation between sections of the public website is driven by a state variable called activeSection, which can hold values such as 'home', 'children', 'donate', 'volunteer', 'contact', or 'about'. No external router library such as React Router is used; instead, conditional rendering based on this state variable determines which section is displayed. This keeps the bundle size small and avoids the complexity of URL-based routing for what is essentially a single-page brochure site with a dashboard. The top navigation bar updates the activeSection value when a link is clicked, and the corresponding section component renders in the main content area.

The public website is organized into six main sections: Home (with a responsive slideshow carousel and live donation statistics), Children (a filterable card grid with adoption and sponsorship modals), Donate (with tabs for monetary and goods donations), Volunteer (a registration form), Contact (a public inquiry form), and About/Team (displaying team member profiles and the founder story). The admin dashboard, rendered when the view state is set to 'admin-dash', provides eleven management tabs covering all data entities in the system. Responsive design is achieved through inline CSS with conditional style objects and media query breakpoints, ensuring the layout adapts correctly across mobile (below 640px), tablet (below 1024px), and desktop screen widths.

5.3 Backend Implementation

The backend entry point is server.js, which loads environment variables from the .env file using dotenv, configures CORS to allow requests from the Vercel frontend origin, sets up the Express JSON body parser and URL-encoded body parser, and serves the /uploads directory as static files for any locally stored assets. On startup, server.js connects to MongoDB Atlas using the MONGO_URI environment variable via Mongoose, and then registers all route modules before starting the HTTP server on the configured port.

The backend follows a modular route-based architecture. Each functional domain has its own route file: authRoutes.js handles user registration and login, childRoutes.js manages child profiles, donationRoutes.js handles monetary donations, goodsDonationRoutes.js manages goods donation submissions, adoptionRoutes.js handles adoption applications, volunteerRoutes.js manages volunteer registrations, memberRoutes.js handles team member profiles, contactRoutes.js manages contact form submissions, slidesRoutes.js handles slideshow photo management, founderStoryRoutes.js manages the founder story singleton, and uploadRoutes.js provides a general-purpose Cloudinary upload endpoint. Each route file is responsible for its own CRUD operations and interacts directly with its corresponding Mongoose model.

Three of the route files — volunteerRoutes.js, slidesRoutes.js, and founderStoryRoutes.js — define their Mongoose schemas inline rather than in separate model files. This was a practical decision during development, as these entities were added later in the project and their schemas are relatively simple. The remaining entities (User, Child, Donation, GoodsDonation, Adoption, Member, Contact) each have dedicated model files in the models/ directory, following the standard Mongoose pattern of defining a schema and exporting a compiled model.

5.4 Authentication Module

User authentication in MakeLife is handled through three endpoints in authRoutes.js. For registration (POST /api/auth/signup), the system checks whether the submitted email already exists in the users collection and returns HTTP 409 if a duplicate is found. If the email is new, bcryptjs hashes the password using 10 salt rounds before saving the user document to MongoDB. A JWT token is then generated using the jsonwebtoken library with the user's ID as the payload and returned to the client. For login (POST /api/auth/signin), the system retrieves the user by email, uses bcrypt.compare to verify the submitted password against the stored hash, and returns a JWT with a 7-day expiry on success or HTTP 401 on failure.

Admin authentication is handled separately via POST /api/auth/admin/signin. Rather than storing admin credentials in the database, the system compares the submitted username and password directly against the ADMIN_USERNAME and ADMIN_PASSWORD environment variables. This approach keeps admin credentials out of the database entirely and makes them easy to rotate without a database migration. On the client side, the JWT token returned by any of these endpoints is stored in localStorage and attached to subsequent API requests as an Authorization: Bearer token header. Protected routes on the backend verify this token before processing the request.

5.5 Cloudinary Integration

Cloudinary integration is configured in config/cloudinary.js. This file imports the Cloudinary SDK and initializes it with the cloud_name, api_key, and api_secret values read from environment variables. It then creates a CloudinaryStorage engine using the multer-storage-cloudinary package, specifying the destination folder within Cloudinary (makelife/children, makelife/members, makelife/slides, or makelife/founder depending on the route) and allowing JPEG and PNG file formats. The configured storage engine is passed to multer to create an upload middleware instance that is applied to the relevant POST and PUT routes.

When an admin submits a form with a photo, the file is intercepted by the multer middleware before the route handler runs. Cloudinary receives the file stream, stores it permanently in the specified folder, and returns a response containing the permanent HTTPS URL of the uploaded image. This URL is available in the route handler as req.file.path and is saved directly to the corresponding MongoDB document's photo or url field. Because the image lives on Cloudinary's CDN rather than the server's local filesystem, it remains accessible even after the Railway backend is redeployed, restarted, or scaled. This solves one of the most common pain points for NGOs using basic cloud hosting, where locally stored photos disappear on every server restart.

5.6 Module-wise Implementation

Children Module

Admins add child profiles through a form that collects the child's name, age, gender, story, and a photo. The photo is uploaded to Cloudinary via the multer middleware and the returned permanent URL is stored in the MongoDB children collection. On the public website, child profiles are displayed as cards in a responsive grid layout. Visitors can filter the displayed cards by age range (using a slider or dropdown) and by gender, with the filtering logic applied client-side on the fetched data array.

Donation Module

Registered users can make monetary donations either as a general contribution or as a sponsorship tied to a specific child. The donation form offers four preset amounts (Rs.200, Rs.750, Rs.1500, Rs.5000) and a custom amount input. When a child is selected for sponsorship, the child's ID and name are included in the POST /api/donations request body and stored in the donation document. The homepage displays live statistics — total funds raised and total donor count — that are recalculated from the donations collection and refreshed every 30 seconds using a setInterval in a useEffect hook.

Goods Donation Module

Users can donate physical goods by selecting from eight categories: food, clothing, books, toys, hygiene products, blankets, stationery, and footwear. Each category reveals a set of category-specific input fields (for example, the food category asks for food type and quantity, while the clothing category asks for sizes and quantities). All submissions are stored in the goodsdonations collection with a default status of 'pending'. Admins can review each submission in the Goods Donations tab and update the status to 'approved' or 'rejected' via a PATCH request.

Adoption Module

Authenticated users can apply to adopt a child by clicking the Adopt button on a child's profile card. The adoption form collects the applicant's name, address, annual income, number of family members, phone number, email, and reason for adoption. Before saving the application, the backend checks for an existing pending application with the same email and childId combination. If a duplicate is found, the API returns HTTP 409 with a descriptive error message. Admins review applications in the Adoptions tab and update their status via PATCH /api/adoptions/:id/status.

Volunteer Module

Any visitor — whether logged in or not — can register as a volunteer. The volunteer form collects the applicant's full name, email, phone number, age, occupation, availability (weekdays, weekends, or both), areas of interest (education, healthcare, fundraising, etc.), and a motivation statement. All records are stored with a default status of 'pending'. Admins can update the status of each volunteer record and delete records that are no longer relevant.

Contact Module

A public contact form on the Contact section collects the visitor's name, email, phone number, and message. No authentication is required to submit a contact inquiry. All submissions are stored in the contacts collection and are visible to admins in the Messages tab of the dashboard, where they can also delete messages once they have been addressed.

Team Members Module

Admins can add, edit, and delete team member profiles from the Members tab. Each profile includes the member's name, role, bio, email, phone number, year joined, and a photo uploaded to Cloudinary. Team member profiles are displayed publicly on the About/Team section of the website in a card-based layout.

Slideshow Module

Admins upload photos for the homepage carousel from the Slideshow tab. Each uploaded image is stored on Cloudinary and its URL is saved to the slides collection. The HomeSlideshow component on the public homepage fetches all slide URLs and displays them in a responsive carousel with heights of 240px on mobile, 340px on tablet, and 480px on desktop. Admins can delete individual slides from the dashboard.

Founder Story Module

The founder story is stored as a singleton document in the founderstories collection. It contains the founder's name, role, bio, photo (Cloudinary URL), and three story paragraphs. Admins can update this content from the Our Story tab. The public About section fetches and displays this document to tell the organization's origin story.

---

CHAPTER 6
SCREENSHOTS

This chapter presents screenshots of the MakeLife application as deployed at https://makelife-mern-project-w4e9.vercel.app/. The screenshots are organized by section — public website, admin dashboard, and mobile responsiveness. Actual screenshots would be inserted at the indicated figure positions during final report preparation.

6.1 Public Website

The public website is the visitor-facing portion of the application. It includes the homepage with a live slideshow and donation statistics, the children section with filterable profile cards, the donation section, the volunteer registration form, the contact form, and the about/team section.

Fig. 6.1 — Homepage — Desktop View
Shows the full homepage on a desktop browser, including the navigation bar, the hero slideshow carousel displaying uploaded photos, and the live donation statistics panel showing total funds raised and donor count.

Fig. 6.2 — Homepage — Mobile View
Shows the homepage rendered on a mobile viewport (375px width), demonstrating the collapsed navigation, the slideshow at its 240px mobile height, and the stacked statistics layout.

Fig. 6.3 — Children Section — Card Grid
Shows the children section displaying all child profiles as cards in a responsive grid. Each card shows the child's photo, name, age, gender, and a brief excerpt of their story, along with Adopt and Sponsor buttons.

Fig. 6.4 — Children Section — Filter Panel
Shows the filter controls above the children grid, including the age range slider and the gender filter dropdown. The grid updates in real time as filter values are changed.

Fig. 6.5 — Adoption Application Modal
Shows the adoption application modal that opens when a logged-in user clicks the Adopt button on a child card. The form includes fields for applicant name, address, annual income, family members, phone, email, and reason for adoption.

Fig. 6.6 — Child Sponsorship Modal
Shows the sponsorship modal that opens when a user clicks the Sponsor button on a child card. The modal displays the selected child's name and photo alongside the donation amount selection.

Fig. 6.7 — Monetary Donation Section
Shows the Donate section with the monetary donation tab active, displaying the four preset amount buttons (Rs.200, Rs.750, Rs.1500, Rs.5000), the custom amount input, and the donor details form.

Fig. 6.8 — Goods Donation Section
Shows the goods donation tab within the Donate section, displaying the eight category selection buttons and the category-specific detail fields that appear after a category is selected.

Fig. 6.9 — Thank You Confirmation Modal
Shows the thank-you modal that appears after a successful monetary or goods donation submission, confirming that the donation has been recorded.

Fig. 6.10 — Volunteer Registration Form
Shows the volunteer registration form in the Volunteer section, including fields for name, email, phone, age, occupation, availability selection, areas of interest checkboxes, and the motivation text area.

Fig. 6.11 — Contact Form
Shows the contact form in the Contact section with fields for name, email, phone, and message, along with the submit button.

Fig. 6.12 — Team Members Section
Shows the About/Team section displaying team member profile cards with photos, names, roles, and brief bios fetched from the members collection.

Fig. 6.13 — Founder Story Section
Shows the Our Story portion of the About section, displaying the founder's photo, name, role, bio, and the three story paragraphs fetched from the founderstories singleton document.

Fig. 6.14 — User Authentication Dropdown
Shows the authentication dropdown in the navigation bar, displaying the login and register options for unauthenticated visitors, and the logout option for logged-in users.

6.2 Admin Dashboard

The admin dashboard is accessible after authenticating via the admin login page. It provides eleven management tabs for complete control over all system entities.

Fig. 6.15 — Admin Dashboard — Overview Tab
Shows the Overview tab of the admin dashboard, displaying key performance indicators including total donations received, total funds raised, number of registered volunteers, and number of pending adoption applications.

Fig. 6.16 — Admin Dashboard — Children Tab
Shows the Children tab where admins can view all child profiles in a table or card layout, add new children using the upload form, edit existing profiles, and delete profiles.

Fig. 6.17 — Admin Dashboard — Slideshow Tab
Shows the Slideshow tab where admins can upload new photos for the homepage carousel, view all currently uploaded slides with their Cloudinary URLs, and delete individual slides.

Fig. 6.18 — Admin Dashboard — Our Story Tab
Shows the Our Story tab where admins can update the founder's name, role, bio, photo, and the three story paragraphs that appear on the public About section.

Fig. 6.19 — Admin Dashboard — Members Tab
Shows the Members tab where admins can add new team member profiles with Cloudinary photo uploads, edit existing member details, and delete member records.

Fig. 6.20 — Admin Dashboard — Donations Tab
Shows the Donations tab displaying a table of all monetary donation records, including donor name, email, phone, amount, donation type (general or sponsorship), and the date of donation.

Fig. 6.21 — Admin Dashboard — Goods Donations Tab
Shows the Goods Donations tab listing all goods donation submissions with their category, donor details, and current status. Admins can approve or reject each submission from this view.

Fig. 6.22 — Admin Dashboard — Adoptions Tab
Shows the Adoptions tab listing all adoption applications with applicant details, the child applied for, and the current status. Admins can approve or reject applications and view full application details.

Fig. 6.23 — Admin Dashboard — Volunteers Tab
Shows the Volunteers tab listing all volunteer registrations with name, contact details, availability, areas of interest, and current status. Admins can update the status and delete records.

Fig. 6.24 — Admin Dashboard — Messages Tab
Shows the Messages tab displaying all contact form submissions with sender name, email, phone, message content, and submission date. Admins can delete messages once addressed.

6.3 Mobile Responsiveness

The application was tested across three viewport widths: 375px (representing a standard mobile phone), 768px (representing a tablet), and 1280px (representing a standard desktop). The layout adapts at each breakpoint to ensure usability on all device types.

Fig. 6.25 — Mobile Navigation Menu
Shows the navigation bar on a 375px mobile viewport, with the full navigation links collapsed into a hamburger-style menu. Tapping the menu icon expands the navigation links in a vertical dropdown.

Fig. 6.26 — Mobile Children Section
Shows the children section on a 375px mobile viewport, with the card grid displaying one card per row and the filter controls stacked vertically above the grid.

Fig. 6.27 — Mobile Admin Dashboard
Shows the admin dashboard on a 375px mobile viewport, demonstrating that the tab navigation and data tables adapt to the narrow screen width, with horizontal scrolling enabled for wide tables.

---

CHAPTER 7
TESTING

7.1 Testing Strategy

Testing for MakeLife was conducted using a manual black-box approach. In black-box testing, the tester interacts with the system through its inputs and outputs without any knowledge of the internal implementation — the focus is entirely on whether the system behaves as specified. This approach was chosen because it closely mirrors how real users and administrators interact with the application, and it is well-suited to validating the functional requirements defined in Chapter 3. A total of 28 test cases were designed to cover all major modules: authentication, child management, donations, goods donations, adoption applications, volunteer registration, contact submission, team member management, slideshow management, and UI responsiveness.

API-level testing was performed using the browser's developer tools network panel and by making direct HTTP requests to the deployed Railway backend. This allowed verification of HTTP status codes, response body structure, and error handling behavior independently of the frontend. No automated testing framework such as Jest or React Testing Library was used in this project; all testing was performed manually. The test results are documented in the tables below.

7.2 Functional Test Cases

The following table presents all 28 functional test cases executed during the testing phase. Each test case specifies the module under test, a description of what is being tested, the input provided, the expected output, and the actual result.

Table 7.1: Functional Test Cases

| TC | Module | Test Description | Input | Expected Output | Result |
|----|--------|-----------------|-------|-----------------|--------|
| TC-01 | Auth | User registration with valid data | Name, email, password | Account created, JWT returned | Pass |
| TC-02 | Auth | Login with correct credentials | Email, password | JWT token returned | Pass |
| TC-03 | Auth | Login with wrong password | Wrong password | 401 Unauthorized | Pass |
| TC-04 | Auth | Duplicate email registration | Existing email | 409 Conflict | Pass |
| TC-05 | Children | Add child with photo | Name, age, photo | Child card appears in grid | Pass |
| TC-06 | Children | Filter by gender | Gender = Girl | Only girl cards shown | Pass |
| TC-07 | Children | Filter by age range | Age 5-10 | Only matching cards shown | Pass |
| TC-08 | Children | Delete child | Admin clicks delete | Child removed from grid | Pass |
| TC-09 | Donation | General donation | Amount, name, email | Donation saved, thank-you modal | Pass |
| TC-10 | Donation | Child sponsorship | Child selected + amount | Sponsorship record saved | Pass |
| TC-11 | Donation | Stats refresh | Wait 30 seconds | Stats update on homepage | Pass |
| TC-12 | Goods | Submit goods donation | Category + details | Record saved as pending | Pass |
| TC-13 | Goods | Admin approve goods | Admin clicks approve | Status updated to approved | Pass |
| TC-14 | Goods | Admin reject goods | Admin clicks reject | Status updated to rejected | Pass |
| TC-15 | Adoption | Submit adoption application | All required fields | Application saved as pending | Pass |
| TC-16 | Adoption | Duplicate adoption prevention | Same email + child | 409 error returned | Pass |
| TC-17 | Adoption | Admin approve adoption | Admin clicks approve | Status updated to approved | Pass |
| TC-18 | Adoption | Admin reject adoption | Admin clicks reject | Status updated to rejected | Pass |
| TC-19 | Volunteer | Register as volunteer | Name, email, motivation | Record saved as pending | Pass |
| TC-20 | Volunteer | Admin update status | Admin selects status | Status updated | Pass |
| TC-21 | Contact | Submit contact form | Name, email, message | Message saved in DB | Pass |
| TC-22 | Members | Add team member with photo | Name, role, photo | Member appears in About section | Pass |
| TC-23 | Members | Phone field 10-digit limit | 11-digit input | Input capped at 10 digits | Pass |
| TC-24 | Slideshow | Upload slideshow photo | Image file | Photo appears in homepage carousel | Pass |
| TC-25 | Cloudinary | Image persistence after redeploy | Upload photo, redeploy | Image still loads | Pass |
| TC-26 | UI | Mobile responsiveness | 375px viewport | Layout adapts correctly | Pass |
| TC-27 | UI | Slideshow responsive height | Mobile/tablet/desktop | 240/340/480px heights | Pass |
| TC-28 | Auth | Unauthenticated donation attempt | No login | Login gate modal shown | Pass |

All 28 test cases passed successfully.

7.3 API Testing

API testing was performed by sending HTTP requests directly to the deployed Railway backend and verifying the response status codes and body content. The tests confirmed that all endpoints return the correct status codes for both successful operations and error conditions, including the 409 conflict response for duplicate adoption applications and the 401 unauthorized response for invalid login credentials. The table below summarizes the API test results.

Table 7.2: API Testing Summary

| Endpoint | Method | Test | Status Code | Result |
|----------|--------|------|-------------|--------|
| /api/auth/signup | POST | Valid registration | 201 | Pass |
| /api/auth/signin | POST | Valid login | 200 | Pass |
| /api/auth/signin | POST | Invalid password | 401 | Pass |
| /api/children | GET | Fetch all children | 200 | Pass |
| /api/children | POST | Add child with photo | 201 | Pass |
| /api/donations | POST | Create donation | 201 | Pass |
| /api/adoptions | POST | Submit application | 201 | Pass |
| /api/adoptions | POST | Duplicate application | 409 | Pass |
| /api/adoptions/:id/status | PATCH | Update status | 200 | Pass |
| /api/goods-donation | POST | Submit goods | 201 | Pass |
| /api/volunteers | POST | Register volunteer | 201 | Pass |
| /api/members | POST | Add member with photo | 201 | Pass |
| /api/slides | POST | Upload slide | 201 | Pass |
| /api/contact | POST | Submit contact | 201 | Pass |

---

CHAPTER 8
CONCLUSIONS AND SCOPE FOR FUTURE WORK

8.1 Conclusions

MakeLife successfully demonstrates how a purpose-built MERN stack application can digitize and streamline the operations of a child welfare NGO. The system replaces manual, paper-based workflows with a secure, cloud-deployed platform that is accessible 24/7 from any device. By combining a public-facing website with a comprehensive admin dashboard, the application serves the needs of donors, volunteers, adoptive families, and NGO staff within a single unified platform.

All eight primary objectives defined in Chapter 1 were met. The application provides a public-facing website for donors, volunteers, and adoptive families, alongside a secure admin dashboard with eleven management tabs. JWT-based authentication with bcrypt password hashing ensures that user data is protected. Cloudinary integration solves the image persistence problem that affects NGOs using basic cloud hosting, where locally stored photos are lost on every server restart or redeployment. The free-tier deployment on Vercel and Railway means the platform is immediately usable by small NGOs without any infrastructure cost.

The testing phase confirmed that all 28 functional test cases passed successfully. This included critical features such as duplicate adoption prevention (returning HTTP 409 when the same email attempts to apply for the same child twice), 10-digit phone number validation enforced at the input level, responsive slideshow rendering at the correct heights across mobile, tablet, and desktop viewports, and Cloudinary image persistence verified by uploading a photo and confirming it remained accessible after a backend redeployment.

The project demonstrates that modern web technologies — when applied thoughtfully to a real-world problem — can deliver meaningful impact for organizations that lack the resources to adopt expensive enterprise software. MakeLife is freely deployable on Vercel and Railway's free tiers, making it accessible to small NGOs across India. The modular architecture of the backend and the component-based structure of the frontend provide a solid foundation for future enhancements without requiring a complete rewrite.

8.2 Scope for Future Work

While MakeLife is fully functional in its current form, several enhancements would significantly increase its value for real-world NGO deployments. The following table outlines the most impactful improvements identified during development and testing.

Table 8.1: Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Payment Gateway Integration | Integrate Razorpay or PayU for actual online payment processing | High |
| Email Notifications | Send automated emails to donors, applicants, and volunteers on status changes | High |
| OTP-based Authentication | Add phone OTP verification for user registration | Medium |
| Advanced Search and Filters | Full-text search across children, donations, and applications | Medium |
| Donation Receipts | Auto-generate PDF receipts for monetary donations | Medium |
| Multi-language Support | Add Hindi and regional language support for wider reach | Medium |
| Mobile Application | Develop a React Native mobile app for Android and iOS | Low |
| Analytics Dashboard | Add charts and graphs for donation trends and volunteer statistics | Low |
| Role-based Access Control | Multiple admin roles with different permission levels | Medium |
| Automated Testing | Implement Jest and React Testing Library for automated test coverage | Low |

The MakeLife platform provides a solid foundation for these enhancements. The modular architecture of the backend and the component-based structure of the frontend make it straightforward to extend the system without disrupting existing functionality. Payment gateway integration, for instance, would only require adding a new route file and a corresponding frontend payment component, without touching any of the existing modules. Email notifications could be added by integrating a service like Nodemailer or SendGrid into the existing route handlers that update application statuses. With continued development, MakeLife has the potential to serve as a comprehensive digital platform for child welfare organizations across India.

---

REFERENCES

[1] W. S. Lasecki, Y. C. Song, H. Kautz, and J. P. Bigham, "Real-time crowd labeling for deployable activity recognition," in Proc. ACM Conf. Computer Supported Cooperative Work, 2013. [Online]. Available: https://www.mongodb.com/docs

[2] Salesforce.org, "Nonprofit Success Pack (NPSP) Documentation," Salesforce, 2023. [Online]. Available: https://powerofus.force.com/s/article/NPSP-Documentation

[3] Bloomerang, "Donor Management Software," Bloomerang, 2023. [Online]. Available: https://bloomerang.co

[4] Bonterra, "Apricot by Bonterra — Case Management Software," 2023. [Online]. Available: https://www.bonterratech.com/products/apricot

[5] SOS Children's Villages India, "Official Website," 2023. [Online]. Available: https://www.soschildrensvillages.in

[6] Udayan Care, "Official Website," 2023. [Online]. Available: https://www.udayancare.org

[7] CRY — Child Rights and You, "Official Website," 2023. [Online]. Available: https://www.cry.org

[8] Smile Foundation, "Official Website," 2023. [Online]. Available: https://www.smilefoundation.in

[9] Bal Asha Trust, "Official Website," 2023. [Online]. Available: https://www.balashatrust.com

[10] Missionaries of Charity, "Overview of Operations," 2023. [Online]. Available: https://www.motherteresa.org

[11] MongoDB, Inc., "MongoDB Documentation," 2023. [Online]. Available: https://www.mongodb.com/docs

[12] OpenJS Foundation, "Express.js Documentation," 2023. [Online]. Available: https://expressjs.com

[13] Meta Open Source, "React Documentation," 2023. [Online]. Available: https://react.dev

[14] OpenJS Foundation, "Node.js Documentation," 2023. [Online]. Available: https://nodejs.org/en/docs

[15] Cloudinary, "Cloudinary Documentation," 2023. [Online]. Available: https://cloudinary.com/documentation

[16] Vercel, "Vercel Platform Documentation," 2023. [Online]. Available: https://vercel.com/docs

[17] Railway, "Railway Platform Documentation," 2023. [Online]. Available: https://docs.railway.app

[18] Auth0, "Introduction to JSON Web Tokens," 2023. [Online]. Available: https://jwt.io/introduction

[19] npm, "bcryptjs Package," 2023. [Online]. Available: https://www.npmjs.com/package/bcryptjs

[20] npm, "multer-storage-cloudinary Package," 2023. [Online]. Available: https://www.npmjs.com/package/multer-storage-cloudinary
