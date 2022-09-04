import { boot } from 'quasar/wrappers';
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
  channels: ['esfandtv'],
});

void client.connect();

const prefix = '!';

export default boot(({ app }) => {
  // something to do
  app.config.globalProperties.$tmi = client;
});

export { client, prefix };
