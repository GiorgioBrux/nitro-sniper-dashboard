const slowsniper = require("../slowsniper/src/index");
const { status } = require("./const");
const { Logger } = require("./log");
const { Update } = require("./update");
const fs = require("fs");
const path = require("path");
const settingspath = path.join(__dirname, "..", "settings.json");

global.io = require("socket.io")({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
global.io.listen(888);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class SniperRun {
  constructor() {
    const update = new Update();

    global.io.on("connect", (socket) => {
      socket.emit("change", this.#config);
      socket.on("sniper", (action) => {
        console.log(`Got action ${action}`);
        if (!this.#runningAction) this.handleAction(action);
      });

      socket.on("checkupdates", () => {
        update.checkupdates();
      });
      socket.on("updateall", () => {
        update.updateall();
      });

      socket.on("settingupdate", (data) => {
        global.settings = data;
        try {
          fs.writeFileSync(settingspath, JSON.stringify(data));
        } catch {}
      });
      socket.on("settingrequest", () => {
        socket.emit("settingback", global.settings);
      });
    });
  }
  #config = {
    status: status.STOPPED,
    last_nitro_sniper: new Date(),
  };
  #runningAction = false;

  async startSockerLogger() {
    const onChange = await import("on-change");
    this.#config = onChange.default(this.#config, (value) => {
      console.log(
        `Change detected -> Sending config packet ${JSON.stringify(
          this.#config
        )}`
      );
      global.io.emit("change", this.#config);
    });
  }

  async startSniper() {
    console.log("Starting sniper...");
    this.#config.status = status.STARTING;
    await slowsniper.init();
    if (global.active.length !== 0) {
      this.#config.status = status.RUNNING;
      this.#config.accounts = global.active.length;
      this.#config.servers = global.guildCount;
      this.#config.uptime = new Date().toISOString();
    }
  }

  async stopSniper() {
    console.log("Stopping sniper...");
    await slowsniper.quit();
    this.#config.status = status.STOPPED;
    this.#config.uptime = null;
    this.#config.accounts = null;
    this.#config.servers = null;
  }

  async handleAction(action) {
    this.#runningAction = true;
    switch (action) {
      case "stop":
        await this.stopSniper();
        break;
      case "start":
        await this.startSniper();
        break;
      case "restart":
        await this.stopSniper();
        await this.startSniper();
        break;
    }
    this.#runningAction = false;
  }

  async log(line) {}
}

async function init() {
  try {
    await fs.readFile(settingspath, "utf-8", (err, data) => {
      global.settings = JSON.parse(data);
    });
  } catch {}

  global.sniper = new SniperRun();
  global.weblogger = new Logger();
  await global.sniper.startSockerLogger();
  await global.sniper.startSniper();
}

module.exports = {
  SniperRun,
};

init();
