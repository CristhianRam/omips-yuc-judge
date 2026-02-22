'use server';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { redirect } from 'next/navigation';

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

const ProblemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  time_limit_ms: z.coerce.number().gt(0, 'Time limit must be positive'),
  memory_limit_mb: z.coerce.number().gt(0, 'Memory limit must be positive'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

const SubmissionSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export async function createProblem(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return {
      message: 'Unauthorized: Only admins and coaches can perform this action',
    };
  }

  const validatedFields = ProblemSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    time_limit_ms: formData.get('time_limit_ms'),
    memory_limit_mb: formData.get('memory_limit_mb'),
    difficulty: formData.get('difficulty'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Problem.',
    };
  }

  const { title, description, time_limit_ms, memory_limit_mb, difficulty } = validatedFields.data;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        time_limit_ms,
        memory_limit_mb,
        difficulty,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create problem: ${errorText}`);
    }

    const problem = await response.json();
    const problemId = problem.id;

    // Handle Test Cases
    // Expecting formData to contain pairs of files: testcase_input_0, testcase_output_0, etc.
    // Or we can iterate through keys.
    // Ideally, the form should send `testcase_input[]` and `testcase_output[]` but iterating specifically might be safer for pairing.

    // Simple approach: Check for `input_file_0` and `output_file_0`, `input_file_1`...
    let i = 0;
    while (formData.has(`input_file_${i}`)) {
      const inputFile = formData.get(`input_file_${i}`) as File;
      const outputFile = formData.get(`output_file_${i}`) as File;

      if (inputFile && outputFile) {
        const tcFormData = new FormData();
        tcFormData.append('name', `Test Case ${i + 1}`);
        tcFormData.append('input_file', inputFile);
        tcFormData.append('output_file', outputFile);

        const tcResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/testcases/${problemId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
          },
          body: tcFormData,
        });

        if (!tcResponse.ok) {
          console.error(`Failed to upload testcase ${i}:`, await tcResponse.text());
          // Should we abort? convert to warning? For now log and continue.
        }
      }
      i++;
    }

  } catch (error) {
    return {
      message: `Database Error: Failed to Create Problem. ${error}`,
    };
  }

  // Revalidate path
  // revalidatePath('/dashboard/problems');
  redirect('/dashboard/problems');
}

export async function updateProblem(id: number, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return {
      message: 'Unauthorized: Only admins and coaches can perform this action',
    };
  }

  const validatedFields = ProblemSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    time_limit_ms: formData.get('time_limit_ms'),
    memory_limit_mb: formData.get('memory_limit_mb'),
    difficulty: formData.get('difficulty'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Problem.',
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update problem: ${await response.text()}`);
    }
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Problem. ${error}`,
    };
  }

  // revalidatePath('/dashboard/problems');
  redirect('/dashboard/problems');
}

import { revalidatePath } from 'next/cache';

export async function deleteProblem(id: number) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    throw new Error('Unauthorized: Only admins and coaches can perform this action');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `Failed to delete problem: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage += ` - ${errorData.detail}`;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to Delete Problem.');
  }

  revalidatePath('/dashboard/problems');
  redirect('/dashboard/problems');
}

export async function submitSolution(problemId: number, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return {
      message: 'Not authenticated. Please log in to submit.',
    };
  }

  const validatedFields = SubmissionSchema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Submit Solution.',
    };
  }

  const { code } = validatedFields.data;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/submissions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({
        problemId: problemId,
        sourceCode: code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Try to parse JSON error if possible
      try {
        const errorJson = JSON.parse(errorText);
        if (typeof errorJson.detail === 'string') {
          return { message: errorJson.detail };
        }
        if (Array.isArray(errorJson.detail)) {
          return { message: errorJson.detail[0]?.msg || 'Validation error' };
        }
        return { message: JSON.stringify(errorJson.detail) || 'Failed to submit solution.' };
      } catch {
        return { message: `Failed to submit solution: ${errorText}` };
      }
    }

    // const result = await response.json();
    return { message: 'Success! Solution queued for judging.' };

  } catch (error) {
    return {
      message: `Network Error: Failed to Submit Solution. ${error}`,
    };
  }
}

export async function deleteTestCase(problemId: number, testcaseId: string) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/testcases/${problemId}/${testcaseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete testcase: ${await response.text()}`);
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to delete test case');
  }
}

export async function createTestCase(problemId: number, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return { message: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/testcases/${problemId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { message: `Failed to create testcase: ${errorText}` };
    }
    return { message: 'Test case created successfully' };
  } catch (error) {
    return { message: `Network Error: ${error}` };
  }
}

export async function updateUserRole(id: string, prevState: { message: string | null; errors: any }, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated', errors: {} };
  }

  if (session.user.role !== 'admin') {
    return { message: 'Unauthorized: Only admins can perform this action', errors: {} };
  }

  const role = formData.get('role');
  if (!role || (role !== 'student' && role !== 'coach' && role !== 'admin')) {
    return { message: 'Invalid role provided', errors: { role: ['Please select a valid role.'] } };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${id}/role?new_role=${role}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { message: `Failed to update user role: ${errorText}`, errors: {} };
    }
  } catch (error) {
    return { message: `Network Error: ${error}`, errors: {} };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}