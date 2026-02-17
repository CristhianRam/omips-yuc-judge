import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Problem,
  Submission,
  TestCase,
} from './definitions';
import { auth } from '@/auth';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchProblems(
  query: string,
  currentPage: number,
) {
  const session = await auth();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Note: The backend API currently supports pagination via skip/limit.
    // Filtering by query (search) might not be fully supported by the backend yet, 
    // or might need a specific endpoint. 
    // For now, we will just list problems with pagination.
    // If backend supports search, we should add `&q=${query}`.

    // Assuming backend endpoint: GET /problems/?skip=...&limit=...
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/?skip=${offset}&limit=${ITEMS_PER_PAGE}`, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
      // Force no-store to ensure fresh data, or use next: { revalidate: 0 }
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch problems from API');
    }

    const problems: Problem[] = await response.json();
    return problems;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch problems.');
  }
}

export async function fetchProblemsPages(query: string) {
  // We need an endpoint to count problems or get total pages.
  // If the backend doesn't provide a count endpoint, we might have to fetch all or guess.
  // For now, I'll assume we can just fetch a large number or 
  // temporarily return a fixed number if the API doesn't support count.

  // Ideally: GET /problems/count?q=...
  // Or check if GET /problems returns a count in headers or envelope.
  // The current backend listing returns a list.

  // WORKAROUND: Just return 1 page for now until backend supports count, 
  // or fetch all to count (inefficient but works for small datasets).

  try {
    const session = await auth();
    // Fetching all (or a large limit) to count. 
    // Backend limit cap is 100.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/?limit=100`, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (!response.ok) return 1;

    const problems = await response.json();
    const totalPages = Math.ceil(problems.length / ITEMS_PER_PAGE);
    return totalPages || 1;
  } catch (error) {
    console.error('API Error:', error);
    return 1;
  }
}

export async function fetchProblemById(id: number) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/${id}`, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      // if 404, maybe return null?
      console.log('Fetching problem with id:', id, typeof id);
      console.log('Full URL:', `${process.env.NEXT_PUBLIC_API}/problems/${id}`);
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch problem. Status: ${response.status}`);
    }

    const problem: Problem = await response.json();
    return problem;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch problem.');
  }
}


export async function fetchMySubmissions(problemId: number) {
  const session = await auth();
  if (!session?.user?.accessToken || !session?.user?.id) {
    return [];
  }

  try {
    // The backend /my/{problemId} endpoint expects a UUID for problemId, but we have an int.
    // Workaround: Use the general listing endpoint with filtering by problemId and userId.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/submissions/?problemId=${problemId}&userId=${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store'
    });

    if (response.status === 404) return [];

    if (!response.ok) {
      console.error('Failed to fetch submissions:', await response.text());
      return [];
    }

    const submissions: Submission[] = await response.json();
    return submissions;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function fetchTestCases(problemId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) return [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/testcases/${problemId}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store'
    });

    if (response.status === 404) return [];
    if (!response.ok) {
      console.error('Failed to fetch testcases:', await response.text());
      return [];
    }

    const testCases: TestCase[] = await response.json();
    return testCases;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}
