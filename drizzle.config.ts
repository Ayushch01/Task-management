import {envConfigs} from "./src/config/envConfig"


export default ({
  dialect: "postgresql", 
  schema: "./src/models/schema.ts",
  out: "./drizzle",
  dbCredentials: {
     url:envConfigs.db.url
  },
});