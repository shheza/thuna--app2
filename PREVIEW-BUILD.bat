@echo off
title Thuna Production Preview
echo ===================================================
echo       Launching Compiled Production Build...
echo ===================================================
echo Opening preview in your browser...
start http://localhost:4173/
call npm run preview
pause
