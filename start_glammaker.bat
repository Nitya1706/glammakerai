@echo off
setlocal
cd /d "%~dp0"

set "SITE_URL=http://127.0.0.1:5000"

if not exist ".venv\Scripts\python.exe" (
    echo GlamMaker's Python environment was not found.
    echo Follow the setup steps in README.md first.
    pause
    exit /b 1
)

curl.exe --silent --fail --output NUL "%SITE_URL%/"
if errorlevel 1 (
    start "GlamMaker server" /min "%~dp0.venv\Scripts\python.exe" "%~dp0backend\app.py"
)

for /l %%I in (1,1,30) do (
    curl.exe --silent --fail --output NUL "%SITE_URL%/"
    if not errorlevel 1 goto open_site
    timeout /t 1 /nobreak >nul
)

echo GlamMaker did not start. Check MongoDB and the server window, then try again.
pause
exit /b 1

:open_site
start "" "%SITE_URL%/"
endlocal
