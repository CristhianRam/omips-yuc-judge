import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users, MockProblems } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


async function seedProblems() {
  // Matches backend/judge/app/models/problem.py
  await sql`
    CREATE TABLE IF NOT EXISTS problem (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      time_limit_ms INT DEFAULT 1000 NOT NULL,
      memory_limit_mb INT DEFAULT 256 NOT NULL,
      difficulty VARCHAR(20) DEFAULT 'medium'
    );
  `;

  // Note: MockProblems uses string IDs and has 'category' which the DB doesn't have.
  // We'll map 'difficulty' to lowercase to match typical backend patterns if needed,
  // though the regex allows (easy|medium|hard).
  const insertedProblems = await Promise.all(
    MockProblems.map(async (problem) => {
      // Map 'Olympic' to 'hard' or keep as is? regex is ^(easy|medium|hard)$
      // The backend model says: difficulty: Optional[str] = Field(default="medium", max_length=20)
      // The router validation says: pattern="^(easy|medium|hard)$"
      // So 'Olympic' might fail validation if fetched via API, but here we insert directly into DB.
      // Let's coerce 'Olympic' to 'hard' for safety, and lowercase others.
      let diff = problem.difficulty.toLowerCase();
      if (diff === 'olympic') diff = 'hard';

      return sql`
        INSERT INTO problem (title, description, time_limit_ms, memory_limit_mb, difficulty)
        VALUES (
            ${problem.title}, 
            ${`Description for ${problem.title}. Category: ${problem.category}`}, 
            1000, 
            256, 
            ${diff}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedProblems;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
      seedProblems(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
