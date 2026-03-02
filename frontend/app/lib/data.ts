import {
  ContestPublic,
  ContestProblemPublic,
  DashboardStats,
  Problem,
  RecentSubmission,
  Scoreboard,
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

// ─── Contests ───────────────────────────────────────────────────────────────

export async function fetchContests(currentPage: number) {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/list?page_size=${ITEMS_PER_PAGE}&page_number=${currentPage}`,
      {
        headers: {
          ...(session?.user?.accessToken
            ? { Authorization: `Bearer ${session.user.accessToken}` }
            : {}),
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch contests from API');
    }

    const data: {
      contests: ContestPublic[];
      current_page: number;
      total_pages: number;
    } = await response.json();
    return data.contests;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch contests.');
  }
}

export async function fetchContestsPages() {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/list?page_size=${ITEMS_PER_PAGE}&page_number=1`,
      {
        headers: {
          ...(session?.user?.accessToken
            ? { Authorization: `Bearer ${session.user.accessToken}` }
            : {}),
        },
      },
    );

    if (!response.ok) return 1;

    const data: {
      contests: ContestPublic[];
      current_page: number;
      total_pages: number;
    } = await response.json();
    return data.total_pages || 1;
  } catch (error) {
    console.error('API Error:', error);
    return 1;
  }
}

export async function fetchContestById(id: number): Promise<ContestPublic | 'forbidden' | null> {
  const session = await auth();
  if (!session?.user?.accessToken) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (response.status === 404) return null;
    if (response.status === 403) return 'forbidden';

    if (!response.ok) {
      throw new Error(`Failed to fetch contest. Status: ${response.status}`);
    }

    const contest: ContestPublic = await response.json();
    return contest;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function fetchContestProblems(contestId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) return [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/${contestId}/problems`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) return [];

    const problems: ContestProblemPublic[] = await response.json();
    return problems;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function fetchContestParticipants(contestId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) return [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/${contestId}/participants`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) return [];

    const participants: UserPublic[] = await response.json();
    return participants;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function fetchContestScoreboard(contestId: number) {
  const session = await auth();
  if (!session?.user?.accessToken) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/contests/${contestId}/scoreboard`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) return null;

    const scoreboard: Scoreboard = await response.json();
    return scoreboard;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export async function fetchDashboardStats(
  role: string,
  userId: string,
): Promise<DashboardStats> {
  const session = await auth();
  const token = session?.user?.accessToken;
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // Helper: fetch a paginated endpoint with page_size=1 to get total count
  async function fetchCount(url: string): Promise<number> {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (!res.ok) return 0;
      const data = await res.json();
      return data.total_pages ?? 0;
    } catch {
      return 0;
    }
  }

  const API = process.env.NEXT_PUBLIC_API;

  // Parallel requests
  const [totalProblems, totalContests, thirdCardValue, recentRes] =
    await Promise.all([
      // Total problems
      fetchCount(`${API}/problems/?page_size=1&page_number=1`),
      // Total contests
      fetchCount(`${API}/contests/list?page_size=1&page_number=1`),
      // 3rd card: students = my submissions count, coach/admin = enrolled students
      role === 'student'
        ? fetchCount(
          `${API}/submissions/?page_size=1&page_number=1&userId=${userId}`,
        )
        : fetchCount(
          `${API}/users/?page_size=1&page_number=1&role=student`,
        ),
      // Recent submissions (last 5)
      fetch(`${API}/submissions/?page_size=5&page_number=1`, {
        headers,
        cache: 'no-store',
      }).catch(() => null),
    ]);

  let recentSubmissions: RecentSubmission[] = [];
  if (recentRes && recentRes.ok) {
    const data: {
      submissions: RecentSubmission[];
      current_page: number;
      total_pages: number;
    } = await recentRes.json();
    recentSubmissions = data.submissions;
  }

  return {
    totalProblems,
    totalContests,
    thirdCardValue,
    recentSubmissions,
  };
}

