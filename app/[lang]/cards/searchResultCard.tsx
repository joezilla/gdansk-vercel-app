

export function SearchResultCard() {
    return (<>
        <div className="bg-gray-900 p-4 rounded-md shadow-md max-w-md">
            <div className="flex items-center space-x-3">
                <img src="https://via.placeholder.com/30" alt="Icon" className="w-6 h-6" />
                <a href="#" className="text-pink-500 text-sm font-semibold">Kopidev</a>
                <span className="text-gray-500 text-sm">https://kopi.dev</span>
            </div>
            <a href="#" className="text-lg font-bold text-white mt-2 block">
                Search with Live Result Using Tailwind UI
            </a>
            <p className="text-gray-400 text-sm mt-1">
                <strong className="text-white">Search with Live Result component</strong> is a Tailwind CSS-powered feature that provides real-time search results, enhancing user experience and interactivity.
            </p>
        </div>
    </>);


}