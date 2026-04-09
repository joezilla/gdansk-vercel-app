import Link from 'next/link'
import Image from 'next/image'
import { Locale } from "../../../i18n-config";

export default async function NotFound({ params }: { params: Promise<{ lang: string }> }) {
    const { lang: langParam } = await params;
    const lang = langParam as Locale;
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-on-surface/60 mb-4">Page Not Found</h1>

                <div className="flex justify-center mb-4">
                    <Image src="/resources/images/confused.webp" alt="Confused face" width={256} height={256} className="w-64 h-64" />
                </div>
                <p className="text-xl text-on-surface/50">
                    Oops! The page you&apos;re looking for doesn&apos;t exist. Try the <a href={`/${lang}/streets/all`} className="text-tertiary underline">Street Overview</a>.
                </p>
            </div>
        </div>
    )
}
