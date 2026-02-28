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
    let i = 0;
    const failedTestCases: number[] = [];
    while (formData.has(`input_file_${i}`)) {
      const inputFile = formData.get(`input_file_${i}`) as File;
      const outputFile = formData.get(`output_file_${i}`) as File;

      if (inputFile && outputFile && inputFile.size > 0 && outputFile.size > 0) {
        const tcFormData = new FormData();
        tcFormData.append('name', `Test Case ${i + 1}`);
        tcFormData.append('input_file', inputFile);
        tcFormData.append('output_file', outputFile);

        try {
          const tcResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/testcases/${problemId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.user.accessToken}`,
            },
            body: tcFormData,
          });

          if (!tcResponse.ok) {
            console.error(`Failed to upload testcase ${i}:`, await tcResponse.text());
            failedTestCases.push(i + 1);
          }
        } catch (tcError) {
          console.error(`Network error uploading testcase ${i}:`, tcError);
          failedTestCases.push(i + 1);
        }
      } else if (formData.has(`input_file_${i}`)) {
        // File field exists but file has no content
        failedTestCases.push(i + 1);
      }
      i++;
    }

    if (failedTestCases.length > 0) {
      return {
        message: `Problem created (ID: ${problemId}), but ${failedTestCases.length} test case(s) failed to upload (Test Cases: ${failedTestCases.join(', ')}). Please go to the problem edit page to add test cases.`,
      };
    }

  } catch (error) {
    return {
      message: `Database Error: Failed to Create Problem. ${error}`,
    };
  }

  revalidatePath('/dashboard/problems');
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

export async function submitSolution(problemId: number, prevState: any, formData: FormData, contestId?: number) {
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
    const body: Record<string, unknown> = {
      problemId: problemId,
      sourceCode: code,
    };
    if (contestId) {
      body.contestId = contestId;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/submissions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
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

export async function submitContestSolution(
  problemId: number,
  contestId: number,
  prevState: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated. Please log in to submit.' };
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
        problemId,
        sourceCode: code,
        contestId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        if (typeof errorJson.detail === 'string') {
          return { message: errorJson.detail };
        }
        if (Array.isArray(errorJson.detail)) {
          return { message: errorJson.detail[0]?.msg || 'Validation error' };
        }
        return { message: JSON.stringify(errorJson.detail) || 'Failed to submit.' };
      } catch {
        return { message: `Failed to submit: ${errorText}` };
      }
    }

    return { message: 'Success! Solution queued for judging.' };
  } catch (error) {
    return { message: `Network Error: ${error}` };
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

// ─── Contest Actions ────────────────────────────────────────────────────────

const ContestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
});

export async function createContest(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return { message: 'Unauthorized: Only admins and coaches can create contests' };
  }

  const validatedFields = ContestSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Contest.',
    };
  }

  const { title, description, start_date, end_date } = validatedFields.data;

  try {
    const body: Record<string, unknown> = {
      title,
      description,
      start_date: new Date(start_date).toISOString(),
    };
    if (end_date) {
      body.end_date = new Date(end_date).toISOString();
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { message: `Failed to create contest: ${errorText}` };
    }
  } catch (error) {
    return { message: `Error: Failed to Create Contest. ${error}` };
  }

  revalidatePath('/dashboard/contests');
  redirect('/dashboard/contests');
}

export async function updateContest(id: number, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return { message: 'Unauthorized' };
  }

  const body: Record<string, unknown> = {};
  const title = formData.get('title');
  const description = formData.get('description');
  const open = formData.get('open');
  const start_date = formData.get('start_date');
  const end_date = formData.get('end_date');

  if (title) body.title = title;
  if (description) body.description = description;
  if (open !== null) body.open = open === 'true';
  if (start_date) body.start_date = new Date(start_date as string).toISOString();
  if (end_date) body.end_date = new Date(end_date as string).toISOString();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contests/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { message: `Failed to update contest: ${errorText}` };
    }
  } catch (error) {
    return { message: `Error: Failed to Update Contest. ${error}` };
  }

  revalidatePath(`/dashboard/contests/${id}`);
  redirect(`/dashboard/contests/${id}`);
}

export async function deleteContest(id: number) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contests/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete contest: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to Delete Contest.');
  }

  revalidatePath('/dashboard/contests');
  redirect('/dashboard/contests');
}

export async function joinContest(contestId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contests/${contestId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        return { message: errorJson.detail || 'Failed to join contest' };
      } catch {
        return { message: `Failed to join contest: ${errorText}` };
      }
    }

    return { message: 'Successfully joined the contest!' };
  } catch (error) {
    return { message: `Error: ${error}` };
  }
}

export async function leaveContest(contestId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contests/${contestId}/leave`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        return { message: errorJson.detail || 'Failed to leave contest' };
      } catch {
        return { message: `Failed to leave contest: ${errorText}` };
      }
    }

    return { message: 'Successfully left the contest.' };
  } catch (error) {
    return { message: `Error: ${error}` };
  }
}

export async function addProblemToContest(contestId: number, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return { message: 'Unauthorized' };
  }

  const problemId = Number(formData.get('problem_id'));
  const points = Number(formData.get('points')) || 100;
  const order = formData.get('order') as string;

  if (!problemId || !order) {
    return { message: 'Problem ID and Order are required.' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contests/${contestId}/addproblem/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({
        problem_id: problemId,
        points,
        order,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        return { message: errorJson.detail || 'Failed to add problem' };
      } catch {
        return { message: `Failed to add problem: ${errorText}` };
      }
    }

    revalidatePath(`/dashboard/contests/${contestId}`);
    return { message: 'Problem added successfully!' };
  } catch (error) {
    return { message: `Error: ${error}` };
  }
}

export async function removeProblemFromContest(contestId: number, problemId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return { message: 'Not authenticated' };
  }

  if (session.user.role !== 'admin' && session.user.role !== 'coach') {
    return { message: 'Unauthorized' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/${contestId}/removeproblem/${problemId}/`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        return { message: errorJson.detail || 'Failed to remove problem' };
      } catch {
        return { message: `Failed to remove problem: ${errorText}` };
      }
    }

    revalidatePath(`/dashboard/contests/${contestId}`);
    return { message: 'Problem removed successfully.' };
  } catch (error) {
    return { message: `Error: ${error}` };
  }
}