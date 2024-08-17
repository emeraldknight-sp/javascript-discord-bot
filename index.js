const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// This is the application token.

const token = process.env.DISCORD_TOKEN;

// This is initializing a client via an instance.

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// The commands apparently are temporarily stored within this "commands" property
// and for this the initialized instance of a Collection is necessary.

client.commands = new Collection();

// path is a module that helps build paths to access files and directories.
// fs is used to read the commands directory and identify our command files.
// The fs.readdirSync() method reads the path to the directory
// and returns an array of all the folder names it contains.

// That is, we use path.join() to obtain the path of a given directory
// and with fs.readdirSync() we obtain folders and files.

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // After obtaining the path and searching the folders,
  // we filter the files that end with .js

  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    // Here, we will retrieve the exported data (module.exports)
    // from each file within the command folder.

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // And we check each file to see if it has a data and an execute file,
    // which are vital for the commands to work properly.

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// ONCE and ONE are event listeners,
// depending on the event we want discord
// to do something every time (ON)
// or to execute it just once (ONCE)

// Every time an interaction is created (ON)

client.on(Events.InteractionCreate, async (interaction) => {
  // If it's not an input command coming from the chat, it doesn't do anything.

  if (!interaction.isChatInputCommand()) return;

  // Search for the name of the command executed and if it does not exist.

  const command = interaction.client.commands.get(interaction.commandName);

  // The check ahead will show an error and will not do anything.

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  // In the code block below it will try to execute the command,
  // but if something is not right for some reason
  // it will check and return the error in a message type.

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// When the client is ready, run this code (ONCE).
client.once(Events.ClientReady, () => {
  console.log("It's okay. Bot's connected!");
});

// Log in to Discord with your client's token
client.login(token);
