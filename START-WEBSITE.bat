@echo off
title Thuna Web App Launcher
echo ===================================================
echo           Starting Thuna Local Server...
echo ===================================================
echo Opening your browser to http://localhost:5173/ ...
start http://localhost:5173/
npm run dev
pause
