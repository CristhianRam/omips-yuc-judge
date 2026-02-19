import {
  Problem,
  Submission,
  TestCase,
} from './definitions';
import { auth } from '@/auth';

const ITEMS_PER_PAGE = 6;

export async function fetchProblems(
  query: string,
  currentPage: number,
) {
  const session = await auth();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/?page_size=${ITEMS_PER_PAGE}&page_number=${currentPage}`, {
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

export async function fetchProblemsPages(query: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/problems/?page_size=${ITEMS_PER_PAGE}&page_number=1`, {
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
