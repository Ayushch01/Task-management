import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import postgreDb,{client} from "./db";
import { envConfigs } from './envconfig';


async function migrateData() {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(postgreDb, { migrationsFolder: `./drizzle/`});
  console.log("Migrations Done")
  await client.end();
}

migrateData().catch((err) => {
  console.error(err);
  process.exit(0);
});


