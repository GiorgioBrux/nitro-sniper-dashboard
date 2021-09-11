const slowsniper = require("../slowsniper/src/index");
const { status } = require("./const");
const { Logger } = require("./log");

const io = require("socket.io")({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.listen(888);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class SniperRun {
  constructor() {
    io.on("connect", (socket) => {
      socket.emit("change", this.#config);
    });
  }
  #config = {
    status: status.STOPPED,
    accounts: "111",
    last_nitro_sniper: new Date(),
    uptime: new Date(),
  };

  async startSockerLogger() {
    const onChange = await import("on-change");
    this.#config = onChange.default(this.#config, (value) => {
      console.log(
        `Change detected -> Sending config packet ${JSON.stringify(
          this.#config
        )}`
      );
      io.emit("change", this.#config);
    });
  }

  async startSniper() {
    console.log("Starting sniper...");
    this.#config.status = status.STARTING;
    await slowsniper.init();
    this.#config.status = status.RUNNING;
    await delay(5000);
    await slowsniper.quit();
    this.#config.status = status.STOPPED;
  }

  async stopSniper() {
    console.log("Stopping sniper...");
    await slowsniper.quit();
    this.#config.status = status.STOPPED;
  }

  async exit() {
    /*    console.log("Changing to stopped");
    this.#config.status = status.STOPPED;*/
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
