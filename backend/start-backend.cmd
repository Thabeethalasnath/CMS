@echo off
cd /d "%~dp0"
echo Starting CMS Spring Boot Backend...
call mvnw.cmd spring-boot:run
pause
