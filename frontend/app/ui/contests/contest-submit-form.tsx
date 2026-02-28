'use client';

import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { submitSolution } from '@/app/lib/actions';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(
    () => import('@/app/ui/codemirror/code-editor'),
    { ssr: false, loading: () => <div className="h-[350px] rounded-md bg-gray-900 animate-pulse" /> }
);

export default function ContestSubmitForm({
    problemId,
    contestId,
}: {
    problemId: number;
    contestId: number;
}) {
    const initialState = { message: null, errors: {} };

    // Bind both problemId and wrap the action to pass contestId
    const submitAction = async (prevState: any, formData: FormData) => {
        return submitSolution(problemId, prevState, formData, contestId);
    };

    // @ts-ignore
    const [state, dispatch] = useActionState(submitAction, initialState);

    return (
        <form action={dispatch} className="mt-6">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <label htmlFor="code" className="mb-2 block text-sm font-medium">
                    Solution Code
                </label>
                <CodeEditor name="code" />
                <div id="code-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.code &&
                        state.errors.code.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        ))}
                </div>
                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className={`mt-2 text-sm ${state.message.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
                            {state.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <Button type="submit">Submit Solution</Button>
            </div>
        </form>
    );
}
