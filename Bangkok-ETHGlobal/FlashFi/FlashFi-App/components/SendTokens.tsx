'use client'

import { ChevronLeft, Info, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import HeaderComponent from "@/components/Header";
interface Token {
  symbol: string
  name: string
  balance: string
  value: number
}

export default function Component() {
  const [selectedToken, setSelectedToken] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const tokens: Token[] = [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5', value: 4875.50 },
    { symbol: 'USDC', name: 'USD Coin', balance: '1000.00', value: 1000.00 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.15', value: 5250.75 }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle transaction submission
  }

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken)

  return (
    <div className="min-h-screen bg-gray-900">

      <HeaderComponent />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Send Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="token" className="text-gray-300">Select Token</Label>
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                      <SelectTrigger id="token" className="w-full bg-gray-900 border-gray-700 text-white mt-1">
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {tokens.map((token) => (
                          <SelectItem
                            key={token.symbol}
                            value={token.symbol}
                            className="text-white hover:bg-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-gray-900">
                                {token.symbol}
                              </div>
                              <span>{token.name}</span>
                              <span className="text-gray-400">
                                ({token.balance} {token.symbol})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                      {selectedTokenData && (
                        <span className="text-sm text-gray-400">
                          Balance: {selectedTokenData.balance} {selectedTokenData.symbol}
                        </span>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white pr-16"
                      />
                      {selectedToken && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400">{selectedToken}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="recipient" className="text-gray-300">Recipient Address</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-4 w-4 text-gray-400">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                            <p>Enter the recipient&apos;s wallet address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white mt-1"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                  disabled={!selectedToken || !amount || !recipient}
                >
                  Review Transaction
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}