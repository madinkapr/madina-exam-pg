import { Pool } from "pg";

const pool = new Pool ({
    host: process.env.PG_HOST,
    port:process.env.PG_PORT,
    user:process.env.PG_USER,
    database:process.env.PG_DBNAME,
    password:process.env.PG_PASSWORD
})

export async function query(sql, ...params){
    const client = await pool.connect();

    try {
        const result =  await client.query(sql, params);
        return result.rows;
    } finally{
        client.release()
    }
}