'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});


const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const SignupSchema = z.object({
  username: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signup(prevState: string | undefined, formData: FormData) {
  console.log('API URL:', process.env.NEXT_PUBLIC_API);
  console.log('Full URL:', `${process.env.NEXT_PUBLIC_API}/auth/register`);
  
  const validatedFields = SignupSchema.safeParse({
    username: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  
  console.log('Validation result:', validatedFields);
  
  if (!validatedFields.success) {
    return 'Missing Fields. Failed to Register.';
  }
  
  const { username, email, password } = validatedFields.data;
  console.log('Data to send:', { username, email, password });
  
  try {
    console.log('About to fetch...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error data:', errorData);
      if (typeof errorData.detail === 'string') return errorData.detail;
      if (Array.isArray(errorData.detail)) return errorData.detail[0]?.msg || 'Validation error';
      return 'Failed to register.';
    }
  } catch (error) {
    console.log('Catch block error:', error);
    return `Failed to Register. Network error. ${error}`;
  }
  redirect('/login');
}