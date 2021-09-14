<h1 align="center">Nitro Sniper Dashboard</h1>

<p align="center">
   A WIP 3rd party dashboard for slow's sniper<br> <br>
   <img src="https://cdn.upload.systems/uploads/8VkrAGGN.png" />
</p>

# Features

- Control your sniper from a cool dashboard.
- Edit settings with a more friendly ui.
- Use slow's powerful sniper in the backend.
- Update all components from the dashboard.

## Installation

#### Prerequisites and warnings
- Node 14.x and npm 7.x is required.
- Git is required.
- Heroku/Replit are currently unsupported. They **may** work, but I haven't tested them.
- This uses a fork of slow's sniper.
  - For this reason, sniper updates may not be immediately available.
  - For this reason, **don't ask or send support requests to slow**.
- Breaking changes to the installation/run processes are expected soon. This **will require manual intervention**.
- The updater hasn't been tested. You are warned!

#### Installation
- `git clone https://github.com/GiorgioBrux/nitro-sniper-dashboard.git`
- `cd nitro-sniper-dashboard`
- `npm install`
- `cd sniperweb`
- `npm install`
- `cd ..`
- `cd slowsniper`
- `npm install`
- `cd ..`

#### Run
- Terminal 1/Backend: `node .`
- Terminal 2/Fronted: `cd sniperweb`, `npm run dev`

This will open an http server listening on port 3000. <br>
I reccomend using a reverse proxy with an http auth/cloudflare access to connect over the internet.

## License
Unlike my sniper, slow's sniper (my fork included) and this dashboard are all unlicensed aka All Rights Reserved ©. <br>
