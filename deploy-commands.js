const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

// Important environment variables for updating commands

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

// Array prepared to receive the commands that will be sent through the request,
// the update process causes the commands to appear in the visual interface
// when the command is entered in the server's text box.

const commands = [];

// Process of naming a path to the directory and getting what's inside.

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Each command is searched for in the iteration,
// the commands folder has subfolders,
// so the code below searches for the commands within the subfolders,
// the commands need to be files ending in .js
// and have in their content a data and an execute function.

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// If everything went well, no error will appear in the terminal
// and then the following instruction initializes a REST,
// it must be something so that we can make the bot command update request.

const rest = new REST().setToken(token);

// The following function will try to update the commands
// through a PUT route and then, if the update is not possible,
// it will show an error in the terminal/console.

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await rest.put(Routes.applicationCommands(clientId, guildId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
