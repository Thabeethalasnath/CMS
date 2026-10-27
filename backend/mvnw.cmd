@echo off
@REM Maven Wrapper Batch Script for Windows

set MAVEN_EXE="C:\Users\Thabe\.m2\wrapper\dists\apache-maven-3.9.9\8e74001100ff70d6af083c5511fcc5ec49282d7017cde82c3698eee8fdf86698\bin\mvn.cmd"
if exist %MAVEN_EXE% goto runMvn

set MAVEN_EXE="C:\Users\Thabe\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd"
if exist %MAVEN_EXE% goto runMvn

for %%X in (mvn.cmd) do (set MAVEN_EXE="%%~$PATH:X")
if exist %MAVEN_EXE% goto runMvn

echo [ERROR] Maven not found! Please check Java and Maven installation.
exit /b 1

:runMvn
call %MAVEN_EXE% %*
exit /b %ERRORLEVEL%
