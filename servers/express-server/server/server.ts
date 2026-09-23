import { app } from '@app/app.js';
import { env } from '@repo/zod-schemas/environment/environments.z.js';
import { fileURLToPath } from 'url';

export function serverExpress() {
  return app.listen(env.HTTP_SERVER_PORT, () => {
    console.log(
      `Server is running on http://localhost:${env.HTTP_SERVER_PORT || 6000}`
    );
  });
}

// CAUTION: This block is for development purposes only.
// In a production environment, avoid directly invoking 'serverExpress()'
// within this file. The primary Node.js process (or process manager like PM2)
// should be responsible for starting, managing, and clustering the server
// to ensure proper scaling and connection handling

const filename = fileURLToPath(import.meta.url);
if (process.argv[1] === filename) {
  serverExpress();
}
