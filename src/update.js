const simpleGit = require("simple-git");
const { exec } = require("child_process");

class Update {
  constructor() {
    this.git = simpleGit();
  }

  async checkupdates() {
    const updates = {
      controller: false,
      website: false,
      sniper: false,
    };

    const controllerstatus = await this.git.fetch().status();

    const gitwebsite = simpleGit(process.cwd() + "/sniperweb");
    const gitsniper = simpleGit(process.cwd() + "/slowsniper");

    const websitestatus = await gitwebsite.fetch().status();
    const sniperstatus = await gitsniper.fetch().status();

    if (controllerstatus.behind > 0) updates.controller = true;
    if (websitestatus.behind > 0) updates.website = true;
    if (sniperstatus.behind > 0) updates.sniper = true;

    await global.io.emit("updateinfo", updates);
  }

  async updateall() {
    exec("sh updateandrestart.sh");
    process.exit();
  }
}

module.exports = { Update };
