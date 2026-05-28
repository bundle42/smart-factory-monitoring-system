# Smart Factory Monitoring System (MES MVP)

NestJS + Next.js + MySQL + Prisma + Socket.IO + Docker 기반의 실시간 설비 모니터링 시스템입니다.

---

## 🚀 프로젝트 소개

스마트 팩토리 환경을 가정하여 설비 상태를 실시간으로 모니터링하고 관리하는 시스템입니다.

- 설비 상태 실시간 모니터링
- 생산량 / 온도 데이터 관리
- 알람 및 로그 기록
- JWT 인증 및 Role 기반 권한 관리
- WebSocket 기반 실시간 데이터 업데이트

---

## 🧱 기술 스택

### Backend

- NestJS
- Prisma ORM
- MySQL
- JWT Authentication
- Socket.IO

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- Socket.IO Client
- Recharts

### DevOps

- Docker
- Docker Compose

---

## ⚙️ 주요 기능

### 🔐 인증

- 회원가입 / 로그인
- JWT 기반 인증
- Role 기반 권한 관리 (ADMIN / OPERATOR)

---

### 🏭 설비 관리

- 설비 CRUD
- 설비 상태 관리 (RUNNING / STOPPED / ERROR / MAINTENANCE)
- 생산량 / 온도 데이터 관리

---

### 📡 실시간 기능

- WebSocket 기반 실시간 설비 상태 업데이트
- 대시보드 자동 반영

---

### 📊 대시보드

- 설비 리스트 조회
- 생산량 Bar Chart
- 온도 Line Chart
- 상태 시각화

---

### 📜 로그 / 알람

- 설비 상태 변경 로그 저장
- 온도 이상 시 알람 생성 (90도 이상)

---

## 🐳 실행 방법 (Docker)

```bash
docker compose up --build
```

---

### 🌐 접속 주소

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
