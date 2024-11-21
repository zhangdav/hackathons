'use client'

import { ChevronDown, ChevronUp, HelpCircle, Plus, Trash2 } from 'lucide-react'
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
import HeaderComponent from "@/components/Header"
interface Signer {
  name: string
  address: string
}

export default function Component() {
  const [signers, setSigners] = useState<Signer[]>([
    { name: 'Signer 1', address: '0xF23f8f87c5654d31c7Ed8d1C...' }
  ])
  const [threshold, setThreshold] = useState('1')
  const walletAddress = '0xF23L.C58E'
  const [expandedSections, setExpandedSections] = useState({
    networkFee: false,
    addressBook: false,
    policy: true
  })

  const addSigner = () => {
    setSigners([...signers, { name: `Signer ${signers.length + 1}`, address: '' }])
    console.log(signers)
  }

  const removeSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index))
  }

  const updateSigner = (index: number, field: keyof Signer, value: string) => {
    const newSigners = [...signers]
    newSigners[index] = { ...newSigners[index], [field]: value }
    setSigners(newSigners)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">

      <HeaderComponent />

      <main className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Create new Flash Account</h1>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-gray-900 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">Signers and confirmations</h2>
                    <p className="text-gray-400 text-sm mb-6">
                      Set the signer wallets of your Flash Account and how many need to confirm to execute a valid transaction.
                    </p>

                    <div className="space-y-4">
                      {signers.map((signer, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Signer name</Label>
                            <Input
                              value={signer.name}
                              onChange={(e) => updateSigner(index, 'name', e.target.value)}
                              className="bg-gray-900 border-gray-700 text-white mt-1"
                            />
                          </div>
                          <div className="relative">
                            <Label className="text-gray-300">Signer</Label>
                            <div className="flex space-x-2">
                              <Input
                                value={signer.address}
                                onChange={(e) => updateSigner(index, 'address', e.target.value)}
                                className="bg-gray-900 border-gray-700 text-white mt-1"
                                placeholder="sep: 0x..."
                              />
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSigner(index)}
                                  className="mt-1 text-gray-400 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        onClick={addSigner}
                        className="text-yellow-400 hover:text-yellow-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add new signer
                      </Button>

                      <div className="mt-6">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold">Threshold</h3>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm mb-2">
                          Any transaction requires the confirmation of:
                        </p>
                        <div className="flex items-center space-x-2">
                          <Select value={threshold} onValueChange={setThreshold}>
                            <SelectTrigger className="w-24 bg-gray-900 border-gray-700 text-white">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {Array.from({ length: signers.length }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                  className="text-white hover:bg-gray-700"
                                >
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-gray-400">out of {signers.length} signer(s)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                  Back
                </Button>
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600">
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                    <h2 className="text-lg font-semibold text-white">Your Flash Account preview</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wallet</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                      <span className="text-white">{walletAddress}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Name</span>
                    <span className="text-white">Flash Account</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network(s)</span>
                    <span className="text-white">Sepolia</span>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="space-y-2">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <button
                          onClick={() => setExpandedSections(s => ({ ...s, networkFee: !s.networkFee }))}
                          className="flex justify-between items-center w-full text-white"
                        >
                          <span>Network fee</span>
                          {expandedSections.networkFee ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <button
                          onClick={() => setExpandedSections(s => ({ ...s, policy: !s.policy }))}
                          className="flex justify-between items-center w-full text-white"
                        >
                          <span>{threshold}/{signers.length} policy</span>
                          {expandedSections.policy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {expandedSections.policy && (
                          <p className="mt-2 text-sm text-gray-400">
                            Use a threshold higher than one to prevent losing access to your Flash Account in case a signer key is lost or compromised.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </main>
    </div>
  )
}