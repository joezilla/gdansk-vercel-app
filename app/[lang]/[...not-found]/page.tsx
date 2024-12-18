import Link from 'next/link'
import { Locale } from "../../../i18n-config";



type Props = {
    params: Promise<{ lang: Locale, slug: string }>
}

export default async function NotFound({ params }: Props) {
    const { lang } = await params;
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <h2 className="text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-4">Page Not Found</h2>

                <div className="flex justify-center mb-4">
                    <img src="/resources/images/confused.webp" alt="Confused face" className="w-64 h-64" />
                </div>
                <p className="text-xl text-gray-500 dark:text-gray-500">
                    Oops! The page you're looking for doesn't exist. Try the <a href={`/${lang}/streets/all`}>Street Overview</a>.
                </p>
            </div>
        </div>
    )
}