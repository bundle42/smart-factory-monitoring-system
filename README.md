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
- 가상 공장 시뮬레이터 기반 설비 데이터 자동 생성

---

### 📊 대시보드

- 설비 리스트 조회
- 생산량 Bar Chart
- 온도 Line Chart
- 상태 시각화
- 시뮬레이터 시작 / 중지 / 수동 갱신 / 초기화

---

### 🧪 가상 공장 시뮬레이터

- 서버 시작 시 `Machine` 데이터가 없으면 가상 설비 4대를 자동 생성합니다.
- 기본 3초마다 온도, 생산량, 상태를 갱신하고 WebSocket으로 `machineUpdated` 이벤트를 전송합니다.
- 환경변수 `SIMULATOR_ENABLED=false`로 자동 실행을 끌 수 있습니다.
- 환경변수 `SIMULATOR_INTERVAL_MS=5000`처럼 갱신 주기를 바꿀 수 있습니다.
- 관리자 권한으로 `/simulator/start`, `/simulator/stop`, `/simulator/tick`, `/simulator/reset`을 호출할 수 있습니다.

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
