# Mission_Capstone

# SLeSCS– Seed Traceability & Certification System

**SLeSCS** is a web-based platform designed to transform seed certification processes in Sierra Leone. The system provides digital workflows for inspection logging,
certificate issuance, QR-based validation, and seed classification using machine learning.

This project is currently live and operational, with both frontend and backend hosted on modern cloud platforms for global access.

- **Live Frontend**: [seed-certificate.vercel.app]
- **GitHub Repo**:https://github.com/aadumbuya/Capstone.git]

---

## Project Features

- Role-based dashboards for inspectors, vendors, and regulatory agencies  
- Seed image upload with ML-powered classification  
- Digital certificate generation and approval workflows  
- QR-code validation for farmers and third-party verifiers  
- Real-time data insights and audit trails  
- Secure login/authentication system  
- Mobile-friendly responsive design  

---

## Tech Stack

- **Frontend**: React.js (hosted on Vercel)  
- **Backend**: Django REST Framework (hosted on Render)  
- **Database**: PostgreSQL  
- **ML Model**: Python 

---

## How to Set Up Locally

### 1. Clone the Repository

```bash
git clone https://github.com/aadumbuya/Capstone.git
cd Capstone
````

### 2. Set Up a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up the Database

Update `settings.py` with your local PostgreSQL credentials or use SQLite for testing.

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Run the Backend Server

```bash
python manage.py runserver
```

### 6. Frontend Setup (If using locally)

Navigate to the frontend folder:

```bash
cd frontend
npm install
npm start
```

> You can skip this step if you're accessing the deployed frontend at [seed-certificate.vercel.app]

---

## Deployment Plan

* **Frontend** is deployed on [Vercel](https://vercel.com) via GitHub integration. Each push to the `main` branch triggers a rebuild.
* **Backend** is deployed on [Render](https://render.com), with PostgreSQL as the cloud database and environment variables stored securely on Render’s dashboard.
* ML services (seed classification) are exposed via Django REST API endpoints and deployed as part of the backend container.

## Figma Design

https://www.figma.com/proto/6Ms0hOk6t75Xe3WW32MnOP/GHAL-Digital-Seed-Certification-System?node-id=57-125&t=bzAB59a9kfxxJ8UP-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1

https://www.canva.com/design/DAGjMwwoD2I/VVvl68ib0XWUdQ5XpujoyA/edit 
