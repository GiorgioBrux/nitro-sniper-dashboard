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

  async log(line) {
    console.log(line);
    io.send(line + "\n");
    this.#history.push(line + "\n");
  }
}

module.exports = { Logger };
