'use client'

import { Check, Circle, Link } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import HeaderComponent from "@/components/Header";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"

interface Token {
  symbol: string
  name: string
  balance: string
  network: string
}

export default function Component() {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<string>('')
  const [nonce, setNonce] = useState('0')

  const tokens: Token[] = [
    { symbol: 'ETH', name: 'Sepolia Ether', balance: '2.5', network: 'sep' },
    { symbol: 'USDC', name: 'USD Coin', balance: '1000.00', network: 'sep' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.15', network: 'sep' }
  ]

  const handleMaxClick = () => {
    const token = tokens.find(t => t.symbol === selectedToken)
    if (token) {
      setAmount(token.balance)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">

      <HeaderComponent />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Link className="h-5 w-5 mr-2" />
                      Send tokens
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Nonce #</span>
                      <Input
                        value={nonce}
                        onChange={(e) => setNonce(e.target.value)}
                        className="w-20 bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-gray-300">Recipient address or ENS</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-3 flex items-center">
                          <span className="text-gray-500">sep:</span>
                        </div>
                        <Input
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className="bg-gray-900 border-gray-700 text-white pl-12"
                          placeholder="0x..."
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Amount</Label>
                      <div className="flex space-x-2 mt-1">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white pr-16"
                            placeholder="0"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMaxClick}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-500"
                          >
                            MAX
                          </Button>
                        </div>
                        <Select value={selectedToken} onValueChange={setSelectedToken}>
                          <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select token" />
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
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                      disabled={!recipientAddress || !amount || !selectedToken}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Circle className="h-5 w-5 mr-2" />
                    Transaction status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-yellow-400">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Create</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Circle className="h-4 w-4 mr-2" />
                      <span>Confirmed (0 of 1)</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Circle className="h-4 w-4 mr-2" />
                      <span>Execute</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}