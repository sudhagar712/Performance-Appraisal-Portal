# Performance Appraisal System (Employee & Manager Portal)

A role-based web application that allows employees to submit self-performance appraisals (KRA/KPI + ratings) and managers to review, rate, and provide feedback.  
Built as a functional prototype for the programming assessment.

---
--------commmand -------
Frontend - npm run dev
backend - npm run server 

##Backedn Api 
 Login - Post  -  http://localhost:8000/api/auth/login (Role based Authenication - manager and employee)
 Logout - Post -  http://localhost:8000/api/auth/logout

##Employee
  CreateDraft (employee) - Post - http://localhost:8000/api/appraisals
  SaveDraft (employee) - Put - http://localhost:8000/api/appraisals/id
  apprasial submitself (employee)- Post - http://localhost:8000/api/appraisals/id/submit

## Manager
 getapprasial-manager  : Get - http://localhost:8000/api/appraisals
 getapprasialbyid   : Get - http://localhost:8000/api/appraisals/id
 manager review - Post - http://localhost:8000/api/appraisals/id/review

## Notification
  getnotifaction : Get - http://localhost:8000/api/notification
  readnotifaction: Post - http://localhost:8000/api/notification/id/read




## ✅ Features

### 🔐 Authentication (Cookie Based)
- Login / Logout using JWT stored in HttpOnly cookies
- Role-based access (Employee / Manager)
- Get current session user (`/me`)

### 👨‍💻 Employee Flow
- Create Self-Appraisal (Draft)
- Add KRAs + Weightage + KPIs
- Self rating (1–5)
- Save Draft
- Submit to Manager

### 👨‍💼 Manager Flow
- View submitted employee appraisals
- Rate each KPI (1–5)
- If manager rating differs from employee rating → feedback required
- Submit review
- Auto approve if no mismatch

### 🔔 Notifications
- Manager gets notification on employee submission
- Employee gets notification on manager review completion
- Mark notifications as read

---

## 🧱 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Redux Toolkit + RTK Query
- React Router DOM

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- HttpOnly Cookies
- CORS configured with credentials


