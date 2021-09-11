const io = require("socket.io")({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.listen(777);

class Logger {
  constructor() {
    console.log("Starting logger...");

    io.on("connection", (socket) => {
      console.log(`Received connection`);
      for (const line of this.#history) socket.send(line);
    });
  }

  #history = [];

  async send_history() {
    for (const line of this.#history) io.send(line);
  }

  async log(line) {
    console.log(line);
    io.send(line);
    this.#history.push(line);
  }
}

module.exports = {
  Logger,
};

const interval = setInterval(function () {
  global.sniper.log("test");
}, 5000);
