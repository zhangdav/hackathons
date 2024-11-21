export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="loader">
                <div className="animate-pulse text-slate-300 flex flex-col justify-center items-center">
                    <svg className="w-6 h-6 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path stroke="currentColor" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z" />
                    </svg>
                    <div>The magic is happening... bear with us...</div>
                </div>
            </div>
        </div>
    );
}