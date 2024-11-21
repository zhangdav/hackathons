'use client'

// LogOut
import { Eye, HelpCircle, Import, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { useState } from 'react'
import HeaderComponent from "@/components/Header"
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()

  // const [isWalletConnected, setIsWalletConnected] = useState(false)
  // const [walletAddress, setWalletAddress] = useState('')

  // const connectWallet = async () => {
  //   // Simulate wallet connection
  //   setIsWalletConnected(true)
  //   setWalletAddress('0xF23L.C58E')
  // }

  return (
    <div className="min-h-screen bg-gray-900">

      <HeaderComponent />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Flash Accounts</h1>
          <Button 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
            onClick={() => router.push('/create')}
          >
            Create Account
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">My accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-center py-8">
                You don&apos;t have any Flash Accounts yet
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-white">Watchlist</CardTitle>
                </div>
                <Button variant="ghost" className="text-yellow-400 hover:text-yellow-500">
                  + Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-center py-8">
                Watch any Flash Account to keep an eye on its activity
              </p>
            </CardContent>
          </Card>

          <div className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <h2 className="text-white">Export or import your Flash data</h2>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                <Upload className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                <Import className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}