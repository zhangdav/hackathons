import { useState } from "react"
import { MenuIcon, XIcon } from 'lucide-react'

import {
  DynamicWidget,
  // useDynamicContext,
} from "@/lib/dynamic";
import Link from "next/link";
//import { useAccount} from 'wagmi'
//import Spinner from "@/components/Spinner";
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { useRouter } from "next/navigation";

export default function Component() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isLoggedIn = useIsLoggedIn();
    const { handleLogOut, setShowAuthFlow } = useDynamicContext()
    const router = useRouter()

    function login() {
        if (!isLoggedIn) {
            setShowAuthFlow(true)
    } else {
      //toast.warning('user is already logged in')
    }
  } 

  async function logout() {
    await handleLogOut()
    router.push('/')
    //setIsMenuOpen?.(false)
  }

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text mr-4">
              FlashFi
            </div>
          </Link>
          <div className="hidden md:flex space-x-4">
            {isLoggedIn && (
              <>
                <Link href="/accounts" className="hover:text-yellow-400 transition-colors">Accounts</Link>
                <Link href="/create" className="hover:text-yellow-400 transition-colors">Create Account</Link>
                {/* <Link href="/add-signers" className="hover:text-yellow-400 transition-colors">Add Signers</Link> */}
                <Link href="/balance" className="hover:text-yellow-400 transition-colors">Balance</Link>
                {/* <Link href="/send-to-address" className="hover:text-yellow-400 transition-colors">Send to Address</Link>
            <Link href="/send-tokens" className="hover:text-yellow-400 transition-colors">Send Tokens</Link> */}
              </>
            )}
          </div>

          { !isLoggedIn && (
            <button 
                className="hidden md:block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-2 px-4 rounded"
                onClick={login} >
                Launch App
            </button>
          )}

          { isLoggedIn && (
            <div className="ml-auto flex items-center gap-4">
                <DynamicWidget />

                <button 
                className="hidden md:block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-2 px-4 rounded"
                onClick={logout} >
                Logout
                </button>

            </div>                      
            )}

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4">
         { isLoggedIn && (
            <>
                <Link href="/accounts" className="block py-2 hover:text-yellow-400 transition-colors">Accounts</Link>
                <Link href="/create" className="block py-2 hover:text-yellow-400 transition-colors">Create Account</Link>
                {/* <Link href="/add-signers" className="block py-2 hover:text-yellow-400 transition-colors">Add Signers</Link> */}
                <Link href="/balance" className="block py-2 hover:text-yellow-400 transition-colors">Balance</Link>
                {/* <Link href="/send-to-address" className="block py-2 hover:text-yellow-400 transition-colors">Send to Address</Link>
                <Link href="/send-tokens" className="block py-2 hover:text-yellow-400 transition-colors">Send Tokens</Link> */}
                <button className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-2 px-4 rounded"
                onClick={logout} >
                    Logout  
                </button>
            </>
         )}
         { !isLoggedIn && (
            <>
                <button className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-2 px-4 rounded"
                onClick={login} >
                    Launch App  
                </button>
            </>
         )}
        </div>
      )}

    </>
  )
}
