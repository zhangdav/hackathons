'use client'

import { Home, LayoutDashboard, Plus, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import HeaderComponent from "@/components/Header"
interface TokenBalance {
  symbol: string
  name: string
  balance: string
  value: number
  profit: number
  profitPercentage: number
}

export default function Component() {
  const [selectedToken, setSelectedToken] = useState<string | undefined>()
  
  const tokens: TokenBalance[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '2.5',
      value: 4875.50,
      profit: 875.25,
      profitPercentage: 21.8
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '1000.00',
      value: 1000.00,
      profit: 0,
      profitPercentage: 0
    },
    {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      balance: '0.15',
      value: 5250.75,
      profit: -125.50,
      profitPercentage: -2.3
    }
  ]

  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0)
  const totalProfit = tokens.reduce((sum, token) => sum + token.profit, 0)

  return (
    <div className="min-h-screen bg-gray-900">


      <HeaderComponent />

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-gray-800 p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">New Transaction</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Select a token and enter the transaction details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {tokens.map((token) => (
                      <SelectItem
                        key={token.symbol}
                        value={token.symbol}
                        className="text-white hover:bg-gray-700"
                      >
                        {token.symbol} - {token.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600">
                  Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <nav className="mt-8 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start text-yellow-400 hover:text-yellow-500 hover:bg-gray-700">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Balances
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-400">Total Value</p>
                      <CardTitle className="text-3xl text-white">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">24h Profit/Loss</p>
                      <p className={`text-lg font-semibold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Token Balances</CardTitle>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-900 hover:bg-gray-850 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold">
                            {token.symbol}
                          </div>
                          <div>
                            <p className="font-medium text-white">{token.name}</p>
                            <p className="text-sm text-gray-400">{token.balance} {token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">${token.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className={`text-sm ${token.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {token.profit >= 0 ? '+' : ''}{token.profitPercentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}