@echo off

echo Starting backend... 3000
cd backend
start cmd /k npm run start:dev

echo Starting frontend... 3001
cd ..\frontend
start cmd /k npm run dev

echo All servers started!
