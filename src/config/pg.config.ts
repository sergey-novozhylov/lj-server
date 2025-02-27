import { get } from 'env-var';
import { registerAs } from '@nestjs/config';

export interface IPgConfig {
  connectionString: string;
}

// Hosting by default provides connection string
// I believe that separate env vars are more convenient for the local development

let connectionString;
if (process.env.HEROKU_POSTGRESQL_PINK_URL) {
  connectionString = process.env.HEROKU_POSTGRESQL_PINK_URL + '?ssl=true';
  console.log('connected production');
} else {
  const conf = {
    host: get('PG_HOST').required().asString(),
    port: get('PG_PORT').required().asPortNumber(),
    database: get('PG_DATABASE').required().asString(),
    username: get('PG_USERNAME').required().asString(),
    password: get('PG_PASSWORD').required().asString(),
    logging: get('PG_LOGGING').default('false').asBoolStrict(),
  };
  connectionString = `postgres://${conf.username}:${conf.password}@${conf.host}:${conf.port}/${conf.database}`;
  console.log('connected somehow')
}
export const pgConfigObj: IPgConfig = {
  connectionString,
};

export const pgConfig = registerAs<IPgConfig>('pg', () => pgConfigObj);
