import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379"
});

async function main() {
  await client.connect();
  console.log("Worker conectado a Redis");

  while (true) {
    const job = await client.blPop("submissions", 0);
    console.log("Job recibido:", job);
  }
}

main();
