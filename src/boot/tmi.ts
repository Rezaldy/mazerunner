import { boot } from 'quasar/wrappers'
import * as tmi from 'tmi.js';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $tmi: tmi.Client;
  }
}

const client = new tmi.Client({
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  channels: ['RizkyBizniz'],
})

void client.connect();

const prefix = '!';
client.on('message', (channel, tags, message, self) => {
  if(self) return;

  if (message.startsWith(prefix)) {
    // Removes the prefix from the command and creates an array of strings from the message
    // Example: ["maze", "left"]
    const context = message.slice(prefix.length).split(/ +/);

    // Returns the first item in the array
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const commandName = context.shift().toLowerCase();

    const commands = ['up', 'down', 'left', 'left'];

    // Checks if the first message in the command is one of the commands in the array.
    if(commands.includes(commandName)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // Command is found and valid, do whatever logic here
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    } else return console.log(`Incoming correct maze command: ${tags.username}: ${message.slice(6)}`);
  } else return;
})

export default boot(({ app }) => {
  // something to do
  app.config.globalProperties.$tmi = client;
});

export { client };
