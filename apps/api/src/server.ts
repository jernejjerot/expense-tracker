import 'dotenv/config';

import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
