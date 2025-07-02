"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Terminal, Wrench, HardDrive, Cpu, Settings, Monitor, Server, ArrowRight, Power, Zap } from "lucide-react"

export default function PureMatteIndustrialLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Matte Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(67deg,transparent_48%,#333_49%,#333_50%,transparent_52%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(156deg,transparent_48%,#444_49%,#444_50%,transparent_52%)] opacity-35"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] opacity-70"></div>
      </div>

      {/* Matte Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-50 p-6"
      >
        <div className="flex justify-between items-center">
          <div className="bg-white text-black px-6 py-3 font-mono font-black tracking-[0.2em] border-4 border-white shadow-[6px_6px_0px_0px_#666] transform -skew-x-2">
            OMNIFI.SYS
          </div>
          <div className="flex gap-4">
            <Badge className="bg-[#1a1a1a] text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#666] transition-all duration-200">
              STATUS: ONLINE
            </Badge>
            <div className="w-4 h-4 bg-white border-2 border-white animate-pulse shadow-[2px_2px_0px_0px_#666]"></div>
          </div>
        </div>
      </motion.nav>

      {/* Matte Hero Section */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Main Matte Terminal Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Left Matte Terminal */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1a1a1a] border-4 border-white shadow-[20px_20px_0px_0px_#666] relative">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-[#666] border border-white shadow-[1px_1px_0px_0px_#666]"></div>
                      <div className="w-4 h-4 bg-[#999] border border-white shadow-[1px_1px_0px_0px_#666]"></div>
                      <div className="w-4 h-4 bg-white border border-white shadow-[1px_1px_0px_0px_#666]"></div>
                    </div>
                    <span className="text-white font-mono text-sm">TERMINAL_001.exe</span>
                  </div>

                  <div className="space-y-4 font-mono text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">root@omnifi:~$</span>
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        npm run initialize-system
                      </motion.span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="space-y-2 text-sm"
                    >
                      <div>[INFO] npm install @omnifi/industrial-framework</div>
                      <div>[INFO] npm run build:matte-components</div>
                      <div>[SUCCESS] Matte industrial system ready</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                      className="pt-6"
                    >
                      <h1
                        className="text-4xl lg:text-6xl font-black tracking-[0.1em] transform -skew-x-1 mb-4 text-white"
                        style={{ textShadow: "3px 3px 0px #666, 6px 6px 0px #999" }}
                      >
                        MATTE INDUSTRIAL
                        <br />
                        <span className="text-[#d1d5db]">SYSTEM FRAMEWORK</span>
                      </h1>
                      <p className="text-[#d1d5db] text-lg tracking-wide max-w-lg">
                        RAW MATTE INTERFACE COMPONENTS FOR UNCOMPROMISING DIGITAL OPERATIONS.
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Matte Control Panel */}
            <div className="space-y-6">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Card className="bg-[#2d2d2d] border-4 border-white shadow-[12px_12px_0px_0px_#666] relative before:absolute before:top-2 before:right-2 before:w-6 before:h-6 before:bg-white before:transform before:rotate-45">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#1a1a1a] border-3 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#666]">
                        <Power className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-mono font-black text-lg text-white">SYSTEM STATUS</h3>
                        <p className="font-mono text-sm text-[#d1d5db]">ALL SYSTEMS OPERATIONAL</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-sm text-white">
                        <span>CPU LOAD</span>
                        <span>23%</span>
                      </div>
                      <div className="w-full h-3 bg-[#0a0a0a] border-2 border-white">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "23%" }}
                          transition={{ delay: 1.2, duration: 1 }}
                          className="h-full bg-white"
                        ></motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Card className="bg-[#1a1a1a] border-4 border-[#d1d5db] shadow-[12px_12px_0px_0px_#666]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#2d2d2d] border-3 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#666]">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-mono font-black text-lg text-white">POWER CORE</h3>
                        <p className="font-mono text-sm text-[#d1d5db]">ENERGY: 97.3%</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-full h-8 bg-[#0a0a0a] border-2 border-white relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute inset-0 bg-white opacity-30"
                      ></motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Matte Action Controls */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex flex-wrap gap-6 justify-center mb-16"
          >
            <Button
              className="bg-white hover:bg-[#e8e8e8] text-black font-black font-mono px-12 py-6 border-4 border-white 
                         shadow-[12px_12px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] 
                         hover:translate-x-2 hover:translate-y-2
                         transition-all duration-300 ease-out tracking-wider text-xl transform -skew-x-1"
            >
              <Terminal className="mr-3 h-6 w-6" />
              npm run start
            </Button>

            <Button
              variant="outline"
              className="bg-[#1a1a1a] border-4 border-white text-white hover:bg-[#2d2d2d] font-black font-mono px-12 py-6 
                         shadow-[12px_12px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] 
                         hover:translate-x-2 hover:translate-y-2
                         transition-all duration-300 ease-out tracking-wider text-xl transform skew-x-1"
            >
              <HardDrive className="mr-3 h-6 w-6" />
              npm run docs
            </Button>
          </motion.div>

          {/* Matte Industrial Grid Layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: Cpu, title: "PROCESSING", value: "847.2 GHz", status: "OPTIMAL" },
              { icon: Server, title: "STORAGE", value: "2.4 TB", status: "AVAILABLE" },
              { icon: Monitor, title: "DISPLAY", value: "4K HDR", status: "ACTIVE" },
              { icon: Settings, title: "CONFIG", value: "v2.1.3", status: "UPDATED" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.6 }}
              >
                <Card
                  className="bg-[#2d2d2d] border-4 border-white shadow-[8px_8px_0px_0px_#666] 
                             hover:shadow-[6px_6px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1
                             transition-all duration-300 ease-out group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-16 h-16 bg-[#1a1a1a] border-3 border-white mx-auto mb-4 flex items-center justify-center 
                                 shadow-[4px_4px_0px_0px_#666] group-hover:shadow-[2px_2px_0px_0px_#666] 
                                 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200"
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-mono font-black text-lg mb-2 text-white">{item.title}</h3>
                    <p className="font-mono text-2xl font-bold mb-1 text-white">{item.value}</p>
                    <Badge className="bg-white text-black font-mono text-xs px-2 py-1 border border-white shadow-[2px_2px_0px_0px_#666]">
                      {item.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Matte Command Line Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-[#1a1a1a] border-4 border-white shadow-[16px_16px_0px_0px_#666]">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Wrench className="w-6 h-6 text-white" />
                  <h2 className="text-white font-mono font-black text-2xl tracking-wider">DEPLOY MATTE SYSTEM</h2>
                </div>

                <div className="flex gap-4">
                  <Input
                    placeholder="npm run deploy --production"
                    className="bg-[#0a0a0a] border-3 border-white text-white placeholder:text-[#666] font-mono 
                               shadow-[4px_4px_0px_0px_#666] focus:shadow-[2px_2px_0px_0px_#666] 
                               focus:translate-x-1 focus:translate-y-1 transition-all duration-200 
                               focus:border-[#d1d5db] focus:outline-none focus:ring-0 flex-1"
                  />
                  <Button
                    className="bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white font-mono font-bold px-6 border-3 border-white 
                               shadow-[4px_4px_0px_0px_#666] hover:shadow-[2px_2px_0px_0px_#666] 
                               hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="mt-6 font-mono text-sm text-[#d1d5db] space-y-1">
                  <div>$ npm install @omnifi/matte-industrial</div>
                  <div>$ npm run build --mode=production</div>
                  <div>$ npm test --coverage --matte</div>
                  <div>$ npm run deploy --env=production</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
