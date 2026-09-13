===================================================================
             THUNA LOCAL SERVICES & WORKER PLATFORM
                   CURRENT SAVED APPLICATION
===================================================================

This folder contains the complete, up-to-date source code and
pre-compiled production build of the Thuna web application.

-------------------------------------------------------------------
HOW TO RUN THE WEBSITE:
-------------------------------------------------------------------
OPTION 1: One-Click Dev Server (Recommended)
  - Double-click START-WEBSITE.bat
  - It will start the server and automatically launch:
    http://localhost:5173/

OPTION 2: One-Click Production Build Preview
  - Double-click PREVIEW-BUILD.bat
  - Runs the optimized, pre-compiled production build at:
    http://localhost:4173/

-------------------------------------------------------------------
FOLDER STRUCTURE:
-------------------------------------------------------------------
- dist/               : Complete pre-compiled production build ready to host
- src/                : All React 19 + TypeScript components and pages
  - components/       : All UI modals, dashboards, navigation & views
  - components/worker/: Rate card, leaderboard, coverage & public profile
  - context/          : Application state and local audio alert system
  - data/             : 27 verified pros & categories
  - utils/            : Emergency sound generator & sound loop engine
- public/             : Icons and public static assets
- node_modules/       : Dependencies pre-installed for offline use
- package.json        : Project scripts and package configuration

-------------------------------------------------------------------
ALL CURRENT FEATURES INCLUDED:
-------------------------------------------------------------------
1. Floating Bottom Menu Bar on Mobile (Resident & Worker view)
2. Verified Worker Tick Symbol & Rate Card Management
3. Urgent Looping Audio Alert with sound generator for SOS emergencies
4. Live Public Profile View with QR Code and share link
5. Places & Coverage custom service zones
6. Leaderboard & Perks podium and ranking standings
7. Direct Call & WhatsApp 0% middleman booking
===================================================================
