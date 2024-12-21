import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { envConfigs } from "./envconfig";
import * as schema from "../models/schema";


export const client = new Client(envConfigs.db.url);

client
.connect()
.then(() => {
    console.log(`PostgresDb Connected Successfully`);
})
.catch((err:any) => {
    console.log(`Error connecting to database: ${err}`);
});

const postgreDb = drizzle(client, { schema: { ...schema } });

export default postgreDb;
