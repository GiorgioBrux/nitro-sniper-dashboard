const slowsniper = require("../slowsniper/src/index");
const { status } = require("./const");
const { Logger } = require("./log");
const { Update } = require("./update");

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
    this.#config.status = status.RUNNING;
    this.#config.accounts = global.active.length;
    this.#config.servers = global.guildCount;
    this.#config.uptime = new Date().toISOString();
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
  process.env.settings = `{
  tokens: {
    main: 'ODg2MzE3MTE3MzQ2MDU0MjA1.YT0Agg.uFRnaSX3mDyrqBw5zWuxnbhqu54',
      alts: [
      '',
    ],
  },
  mode: 'main'
}`;

  global.sniper = new SniperRun();
  global.weblogger = new Logger();
  await global.sniper.startSockerLogger();
  await global.sniper.startSniper();
}

module.exports = {
  SniperRun,
};

init();
