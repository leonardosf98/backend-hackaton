require("dotenv").config();
const { Connector } = require("@google-cloud/cloud-sql-connector");
const mysql = require("mysql2/promise");

async function main() {
  const connector = new Connector();
  console.log(process.env.HOST);
  const clientOptions = await connector.getOptions({
    instanceConnectionName: process.env.HOST,
    ipType: "PUBLIC",
  });
  const pool = await mysql.createPool({
    ...clientOptions,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
  });
  const conn = await pool.getConnection();
  const [result] = await conn.query(`SELECT NOW();`);
  console.table(result);
  await pool.end();
}
main().catch((error) => {
  console.log(error);
});
