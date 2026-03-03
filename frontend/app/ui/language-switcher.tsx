'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
    const t = useTranslations('languageSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-1">
            {routing.locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => handleChange(loc)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${locale === loc
                            ? 'bg-white text-blue-600'
                            : 'bg-blue-400/30 text-white hover:bg-blue-400/50'
                        }`}
                >
                    {t(loc)}
                </button>
            ))}
        </div>
    );
}
