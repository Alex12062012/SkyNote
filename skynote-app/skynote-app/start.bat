@echo off
echo ========================================
echo    REVIZ - Demarrage de l'application
echo ========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe !
    echo Telecharge-le sur : https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detecte !
echo.

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo Installation des dependances du backend...
    call npm install
)

if not exist "client\node_modules" (
    echo Installation des dependances du frontend...
    cd client
    call npm install
    cd ..
)

echo.
echo ========================================
echo   Demarrage de REVIZ...
echo ========================================
echo.
echo Backend : http://localhost:3001
echo Frontend : http://localhost:3000
echo.
echo Appuie sur Ctrl+C pour arreter
echo.

REM Démarrer le backend en arrière-plan
start /b cmd /c "node server.js"

REM Attendre 3 secondes
timeout /t 3 /nobreak >nul

REM Démarrer le frontend
cd client
call npm start

pause
