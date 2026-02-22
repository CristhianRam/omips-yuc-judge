import {
  Problem,
  Submission,
  SubmissionPreview,
  TestCase,
  UserPublic,
} from './definitions';
import { auth } from '@/auth';

const ITEMS_PER_PAGE = 6;

export async function fetchProblems(
  query: string,
  currentPage: number,
  difficulty?: string
) {
  const session = await auth();

  try {
    let url = `${process.env.NEXT_PUBLIC_API}/problems/?page_size=${ITEMS_PER_PAGE}&page_number=${currentPage}`;
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch problems from API');
    }

    const data: { problems: Problem[]; current_page: number; total_pages: number } = await response.json();
    return data.problems;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch problems.');
  }
}

export async function fetchProblemsPages(query: string, difficulty?: string) {
  try {
    const session = await auth();
    let url = `${process.env.NEXT_PUBLIC_API}/problems/?page_size=${ITEMS_PER_PAGE}&page_number=1`;
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (!response.ok) return 1;

    const data: { problems: Problem[]; current_page: number; total_pages: number } = await response.json();
    return data.total_pages || 1;
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/submissions/my/${problemId}`, {
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

// ─── Submissions List (with filters) ────────────────────────────────────────

export async function fetchSubmissions(
  currentPage: number,
  verdict?: string,
  status?: string,
  userId?: string,
) {
  const session = await auth();
  if (!session?.user?.accessToken) return [];

  try {
    const params = new URLSearchParams();
    params.set('page_size', ITEMS_PER_PAGE.toString());
    params.set('page_number', currentPage.toString());
    if (verdict) params.set('verdict', verdict);
    if (status) params.set('status', status);
    if (userId) params.set('userId', userId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/submissions/?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch submissions:', await response.text());
      return [];
    }

    const data: { submissions: SubmissionPreview[]; current_page: number; total_pages: number } = await response.json();
    return data.submissions;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function fetchSubmissionsPages(
  verdict?: string,
  status?: string,
  userId?: string,
) {
  const session = await auth();
  if (!session?.user?.accessToken) return 1;

  try {
    const params = new URLSearchParams();
    params.set('page_size', ITEMS_PER_PAGE.toString());
    params.set('page_number', '1');
    if (verdict) params.set('verdict', verdict);
    if (status) params.set('status', status);
    if (userId) params.set('userId', userId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/submissions/?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) return 1;

    const data: { submissions: SubmissionPreview[]; current_page: number; total_pages: number } = await response.json();
    return data.total_pages || 1;
  } catch (error) {
    console.error('API Error:', error);
    return 1;
  }
}

// ─── Users List ─────────────────────────────────────────────────────────────

export async function fetchUsers(currentPage: number, role?: string) {
  const session = await auth();
  if (!session?.user?.accessToken) return [];

  try {
    const params = new URLSearchParams();
    params.set('page_size', ITEMS_PER_PAGE.toString());
    params.set('page_number', currentPage.toString());
    if (role) params.set('role', role);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch users:', await response.text());
      return [];
    }

    const data: { users: UserPublic[]; current_page: number; total_pages: number } = await response.json();
    return data.users;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function fetchUsersPages(role?: string) {
  const session = await auth();
  if (!session?.user?.accessToken) return 1;

  try {
    const params = new URLSearchParams();
    params.set('page_size', ITEMS_PER_PAGE.toString());
    params.set('page_number', '1');
    if (role) params.set('role', role);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) return 1;

    const data: { users: UserPublic[]; current_page: number; total_pages: number } = await response.json();
    return data.total_pages || 1;
  } catch (error) {
    console.error('API Error:', error);
    return 1;
  }
}

export async function fetchUserById(userId: string) {
  const session = await auth();
  if (!session?.user?.accessToken) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store',
    });

    if (response.status === 404) return null;

    if (!response.ok) {
      console.error('Failed to fetch user:', await response.text());
      return null;
    }

    const user: UserPublic = await response.json();
    return user;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
