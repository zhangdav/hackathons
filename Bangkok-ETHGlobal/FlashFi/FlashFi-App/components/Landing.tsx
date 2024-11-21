
import HeaderComponent from "@/components/Header"

export default function Landing() {

//  const { sdkHasLoaded, user } = useDynamicContext();
//  const [isLoading, setIsLoading] = useState<boolean>(true);
//  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <HeaderComponent />

      <main className="container mx-auto mt-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
                Flash Loans to
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                  Empower DeFi
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl">
            Unlock the power of decentralized flash loans with FlashFi. Seamlessly borrow and lend assets in a single transaction.
          </p>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200">
            Get Started
          </button>
        </div>
      </main>
    </div>
  )
}