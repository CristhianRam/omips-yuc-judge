/**
 * @file frontend/app/ui/dashboard/cards.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols DashboardCards, Card
 */

import { BookOpen, Trophy, Users, Send } from 'lucide-react';
import { lusitana } from '@/app/ui/fonts';
import { getTranslations } from 'next-intl/server';

interface CardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    badge?: string;
    borderColor?: string;
}

function Card({ title, value, icon, badge, borderColor = 'border-gray-200' }: CardProps) {
    return (
        <div
            className={`rounded-xl border-2 ${borderColor} bg-white p-5 transition-shadow hover:shadow-md`}
        >
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    {icon}
                </div>
                {badge && (
                    <span className="text-xs font-medium text-gray-500">{badge}</span>
                )}
            </div>
            <p className="mt-3 text-sm font-medium text-gray-500">{title}</p>
            <p className={`${lusitana.className} mt-1 text-3xl font-bold text-gray-900`}>
                {value}
            </p>
        </div>
    );
}

export async function DashboardCards({
    role,
    totalProblems,
    totalContests,
    thirdCardValue,
}: {
    role: string;
    totalProblems: number;
    totalContests: number;
    thirdCardValue: number;
}) {
    const isCoachOrAdmin = role === 'admin' || role === 'coach';
    const t = await getTranslations('dashboard');

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
                title={t('totalProblems')}
                value={totalProblems}
                icon={<BookOpen className="h-5 w-5 text-blue-600" />}
                borderColor="border-blue-100"
            />
            <Card
                title={t('activeContests')}
                value={totalContests}
                icon={<Trophy className="h-5 w-5 text-amber-500" />}
                borderColor="border-amber-100"
            />
            {isCoachOrAdmin ? (
                <Card
                    title={t('enrolledStudents')}
                    value={thirdCardValue}
                    icon={<Users className="h-5 w-5 text-teal-600" />}
                    borderColor="border-teal-100"
                />
            ) : (
                <Card
                    title={t('mySubmissions')}
                    value={thirdCardValue}
                    icon={<Send className="h-5 w-5 text-green-600" />}
                    borderColor="border-green-100"
                />
            )}
        </div>
    );
}
