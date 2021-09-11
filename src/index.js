const slowsniper = require("../slowsniper/src/index");

//eval(fs.readFileSync("../slowsniper/src/index") + "");

const status = {
  STARTING: "Starting",
  RUNNING: "Running",
  SHUTTING_DOWN: "Shutting Down",
  STOPPED: "Stopped",
};

class SniperRun {
  constructor() {}

  #status = status.STOPPED;
  #config;

  async start() {
    console.log("Starting sniper...");
    this.#status = status.STARTING;
    await slowsniper();
    this.#status = status.STOPPED;
  }

  async stop() {}
}

const sniper = new SniperRun();
sniper.start();

module.exports = {
  SniperRun,
  status,
};

const interval = setInterval(function () {
  //component.methods.changeState(status.SHUTTING_DOWN);
}, 10000);
