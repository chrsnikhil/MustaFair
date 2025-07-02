"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Wrench, HardDrive, Terminal, Cpu, Settings, Monitor, Server, Hammer } from "lucide-react"

/**
 * OMNIFI GRUNGY BRUTALIST DESIGN SYSTEM
 *
 * Raw, industrial design language with distressed aesthetics
 */

export default function GrungyStyleGuide() {
  return (
    <div className="min-h-screen bg-[#e8e8e8] relative p-8 overflow-hidden">
      {/* Complex Grungy Background */}
      <div className="absolute inset-0 opacity-20">
        {/* Diagonal stripes */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#000_1px,transparent_1px,transparent_8px,#000_9px,#000_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        {/* Scratches */}
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(67deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(156deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] opacity-25"></div>
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTUgMCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] opacity-60"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-7xl font-black text-black font-mono tracking-[0.2em] mb-4 relative transform -skew-x-2 
                       before:absolute before:inset-0 before:bg-black before:opacity-10 before:transform before:skew-x-1
                       after:absolute after:top-2 after:left-2 after:right-2 after:bottom-2 after:border-2 after:border-black after:opacity-30"
            style={{
              textShadow: "3px 3px 0px #666, 6px 6px 0px #333",
              letterSpacing: "0.15em",
            }}
          >
            OMNIFI
            <br />
            <span className="text-5xl tracking-[0.3em]">GRUNGY SYSTEM</span>
          </motion.h1>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-xl text-[#2d2d2d] font-mono font-bold tracking-[0.2em] relative"
          >
            <div className="bg-black text-white px-6 py-2 inline-block transform skew-x-2 border-4 border-black shadow-[4px_4px_0px_0px_#666]">
              INDUSTRIAL • DISTRESSED • BRUTAL
            </div>
          </motion.div>
        </div>

        {/* Color Palette */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card
            className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000] 
                       hover:translate-x-1 hover:translate-y-1 hover:shadow-[18px_18px_0px_0px_#000000] 
                       transition-all duration-500 ease-out relative
                       before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] before:opacity-5"
          >
            <CardHeader className="relative">
              <CardTitle className="text-3xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
                COLOR PALETTE
              </CardTitle>
              <div className="absolute top-2 right-2 w-8 h-8 bg-black transform rotate-45"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "PURE BLACK", hex: "#000000", class: "bg-black" },
                  { name: "DARK GRAY", hex: "#374151", class: "bg-[#374151]" },
                  { name: "MEDIUM GRAY", hex: "#6b7280", class: "bg-[#6b7280]" },
                  { name: "LIGHT GRAY", hex: "#d1d5db", class: "bg-[#d1d5db]" },
                  { name: "LIGHTER GRAY", hex: "#e5e5e5", class: "bg-[#e5e5e5]" },
                  { name: "BACKGROUND", hex: "#e8e8e8", class: "bg-[#e8e8e8] border border-gray-400" },
                  { name: "PURE WHITE", hex: "#ffffff", class: "bg-white border border-gray-400" },
                  { name: "ACCENT GRAY", hex: "#1f2937", class: "bg-[#1f2937]" },
                ].map((color, index) => (
                  <motion.div
                    key={color.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center relative group"
                  >
                    <div
                      className={`w-full h-20 ${color.class} border-3 border-black shadow-[6px_6px_0px_0px_#000000] mb-2 relative
                                 before:absolute before:top-1 before:left-1 before:w-2 before:h-2 before:bg-black before:opacity-30
                                 group-hover:shadow-[8px_8px_0px_0px_#000000] transition-all duration-300 ease-out`}
                    />
                    <p className="text-xs font-bold font-mono text-black tracking-wider">{color.name}</p>
                    <p className="text-xs font-mono text-[#374151] bg-black text-white px-1">{color.hex}</p>
                    {index % 3 === 0 && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-black transform rotate-45"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card
            className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000] 
                       hover:translate-x-1 hover:translate-y-1 hover:shadow-[18px_18px_0px_0px_#000000] 
                       transition-all duration-500 ease-out relative
                       before:absolute before:inset-0 before:bg-[linear-gradient(135deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] before:opacity-5"
          >
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
                TYPOGRAPHY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <h1
                    className="text-6xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1"
                    style={{ textShadow: "2px 2px 0px #666, 4px 4px 0px #333" }}
                  >
                    HEADING 1 - MONO BLACK
                  </h1>
                  <code className="text-sm bg-black text-white px-3 py-2 font-mono block mt-2 border-2 border-black">
                    text-6xl font-black font-mono tracking-[0.1em] transform -skew-x-1
                  </code>
                </div>
                <div>
                  <h2 className="text-4xl font-bold font-mono text-black tracking-wider transform skew-x-1">
                    HEADING 2 - MONO BOLD
                  </h2>
                  <code className="text-sm bg-black text-white px-3 py-2 font-mono block mt-2 border-2 border-black">
                    text-4xl font-bold font-mono tracking-wider transform skew-x-1
                  </code>
                </div>
                <div>
                  <p className="text-xl font-medium text-[#2d2d2d] font-mono tracking-wide">
                    BODY TEXT - MONOSPACE FOR INDUSTRIAL FEEL
                  </p>
                  <code className="text-sm bg-black text-white px-3 py-2 font-mono block mt-2 border-2 border-black">
                    text-xl font-medium text-[#2d2d2d] font-mono tracking-wide
                  </code>
                </div>
                <div>
                  <p className="text-sm font-mono font-bold text-white tracking-[0.2em] bg-black px-2 py-1 inline-block">
                    TECHNICAL TEXT - ULTRA CONDENSED
                  </p>
                  <code className="text-sm bg-black text-white px-3 py-2 font-mono block mt-2 border-2 border-black">
                    font-mono font-bold tracking-[0.2em] bg-black text-white
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card
            className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000] 
                       hover:translate-x-1 hover:translate-y-1 hover:shadow-[18px_18px_0px_0px_#000000] 
                       transition-all duration-500 ease-out relative
                       before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] before:opacity-5"
          >
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
                BUTTONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-6">
                {/* Primary Button */}
                <div className="space-y-2">
                  <Button
                    className="bg-black hover:bg-[#2d2d2d] text-white font-black font-mono px-8 py-4 border-4 border-black 
                               shadow-[8px_8px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] 
                               hover:translate-x-1 hover:translate-y-1
                               transition-all duration-300 ease-out tracking-wider relative
                               before:absolute before:top-1 before:left-1 before:w-2 before:h-2 before:bg-white before:opacity-20"
                  >
                    <Wrench className="mr-2 h-5 w-5" />
                    PRIMARY
                  </Button>
                  <code className="block text-xs bg-black text-white p-2 font-mono border-2 border-black">
                    bg-black border-4 shadow-[8px_8px_0px_0px_#666] font-mono
                  </code>
                </div>

                {/* Secondary Button */}
                <div className="space-y-2">
                  <Button
                    className="bg-[#4a4a4a] hover:bg-[#2d2d2d] text-white font-black font-mono px-8 py-4 border-4 border-[#4a4a4a] 
                               shadow-[8px_8px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] 
                               hover:translate-x-1 hover:translate-y-1
                               transition-all duration-300 ease-out tracking-wider transform skew-x-2"
                  >
                    <Terminal className="mr-2 h-5 w-5" />
                    SECONDARY
                  </Button>
                  <code className="block text-xs bg-black text-white p-2 font-mono border-2 border-black">
                    bg-[#4a4a4a] border-4 shadow-[8px_8px_0px_0px_#000000] transform skew-x-2
                  </code>
                </div>

                {/* Outline Button */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="bg-[#f5f5f5] border-4 border-black text-black hover:bg-[#e8e8e8] font-black font-mono px-8 py-4 
                               shadow-[8px_8px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] 
                               hover:translate-x-1 hover:translate-y-1
                               transition-all duration-300 ease-out tracking-wider transform -skew-x-1"
                  >
                    <HardDrive className="mr-2 h-5 w-5" />
                    OUTLINE
                  </Button>
                  <code className="block text-xs bg-black text-white p-2 font-mono border-2 border-black">
                    bg-[#f5f5f5] border-4 border-black transform -skew-x-1
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card
            className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000] 
                       hover:translate-x-1 hover:translate-y-1 hover:shadow-[18px_18px_0px_0px_#000000] 
                       transition-all duration-500 ease-out relative
                       before:absolute before:inset-0 before:bg-[linear-gradient(135deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] before:opacity-5"
          >
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
                CARDS & CONTAINERS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Feature Card */}
                <div className="space-y-2">
                  <Card
                    className="bg-[#f5f5f5] border-4 border-black shadow-[12px_12px_0px_0px_#666] 
                               hover:shadow-[10px_10px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1
                               transition-all duration-400 ease-out relative group
                               before:absolute before:top-2 before:right-2 before:w-6 before:h-6 before:bg-black before:transform before:rotate-45"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div
                        className="w-20 h-20 bg-[#4a4a4a] border-4 border-black flex items-center justify-center 
                                      shadow-[6px_6px_0px_0px_#000000] transform -skew-x-2
                                      group-hover:shadow-[4px_4px_0px_0px_#000000] group-hover:translate-x-1 group-hover:translate-y-1
                                      transition-all duration-300 ease-out"
                      >
                        <Cpu className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-black font-mono tracking-wider">FEATURE CARD</h3>
                      <p className="text-[#2d2d2d] font-mono font-medium tracking-wide">
                        INDUSTRIAL DESCRIPTION TEXT WITH MONOSPACE STYLING.
                      </p>
                    </CardContent>
                  </Card>
                  <code className="block text-xs bg-black text-white p-2 font-mono border-2 border-black">
                    border-4 border-black shadow-[12px_12px_0px_0px_#666] transform -skew-x-2
                  </code>
                </div>

                {/* Dark Card */}
                <div className="space-y-2">
                  <Card
                    className="bg-black border-4 border-[#666] shadow-[12px_12px_0px_0px_#666] 
                               hover:shadow-[10px_10px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1
                               transition-all duration-400 ease-out relative group
                               before:absolute before:top-2 before:left-2 before:w-6 before:h-6 before:bg-white before:transform before:rotate-45 before:opacity-20"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div
                        className="w-20 h-20 bg-[#666] border-4 border-white flex items-center justify-center 
                                      shadow-[6px_6px_0px_0px_white] transform skew-x-2
                                      group-hover:shadow-[4px_4px_0px_0px_white] group-hover:translate-x-1 group-hover:translate-y-1
                                      transition-all duration-300 ease-out"
                      >
                        <Server className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white font-mono tracking-wider">DARK CARD</h3>
                      <p className="text-[#d1d5db] font-mono font-medium tracking-wide">
                        WHITE TEXT ON DARK INDUSTRIAL BACKGROUND.
                      </p>
                    </CardContent>
                  </Card>
                  <code className="block text-xs bg-black text-white p-2 font-mono border-2 border-black">
                    bg-black border-4 border-[#666] shadow-[12px_12px_0px_0px_#666]
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card
            className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000] 
                       hover:translate-x-1 hover:translate-y-1 hover:shadow-[18px_18px_0px_0px_#000000] 
                       transition-all duration-500 ease-out relative
                       before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] before:opacity-5"
          >
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
                FORM ELEMENTS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="ENTER TEXT HERE"
                    className="bg-[#f5f5f5] border-4 border-[#666] text-black placeholder:text-[#666] font-bold font-mono 
                               shadow-[6px_6px_0px_0px_#666] focus:shadow-[4px_4px_0px_0px_#666] focus:translate-x-1 focus:translate-y-1
                               transition-all duration-300 ease-out tracking-wider transform skew-x-1
                               focus:border-black focus:outline-none focus:ring-0"
                  />
                  <code className="block text-xs bg-black text-white p-2 font-mono border-2 border-black">
                    border-4 border-[#666] shadow-[6px_6px_0px_0px_#666] font-mono transform skew-x-1
                  </code>
                </div>
                <div className="flex gap-4">
                  <Badge
                    className="bg-[#4a4a4a] hover:bg-[#2d2d2d] text-white font-bold font-mono px-4 py-2 border-3 border-black 
                                   shadow-[3px_3px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] 
                                   hover:translate-x-0.5 hover:translate-y-0.5
                                   transition-all duration-200 ease-out tracking-wider transform -skew-x-1 cursor-pointer"
                  >
                    ACTIVE
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-[#f5f5f5] hover:bg-[#e8e8e8] border-3 border-black text-black font-bold font-mono px-4 py-2 
                               shadow-[3px_3px_0px_0px_#666] hover:shadow-[2px_2px_0px_0px_#666] 
                               hover:translate-x-0.5 hover:translate-y-0.5
                               transition-all duration-200 ease-out tracking-wider transform skew-x-1 cursor-pointer"
                  >
                    INACTIVE
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3D Effects & Animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card
            className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000] 
                       hover:translate-x-1 hover:translate-y-1 hover:shadow-[18px_18px_0px_0px_#000000] 
                       transition-all duration-500 ease-out relative
                       before:absolute before:inset-0 before:bg-[linear-gradient(135deg,transparent_48%,#000_49%,#000_50%,transparent_52%)] before:opacity-5"
          >
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
                ANIMATIONS & EFFECTS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Smooth Float Animation */}
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="w-20 h-20 bg-[#666] border-4 border-black mx-auto flex items-center justify-center shadow-[8px_8px_0px_0px_#000000] relative
                               before:absolute before:inset-0 before:bg-black before:opacity-20 before:transform before:skew-x-2"
                  >
                    <Settings className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="font-bold font-mono text-black tracking-wider">FLOAT</p>
                  <code className="block text-xs bg-black text-white p-1 font-mono border-2 border-black">
                    animate={`{y: [0, -8, 0], rotate: [0, 2, -2, 0]}`}
                  </code>
                </div>

                {/* Smooth Pulse Animation */}
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.8, 1],
                      rotate: [0, 1, -1, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="w-20 h-20 bg-[#4a4a4a] border-4 border-black mx-auto flex items-center justify-center shadow-[8px_8px_0px_0px_#000000] transform"
                  >
                    <Monitor className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="font-bold font-mono text-black tracking-wider">PULSE</p>
                  <code className="block text-xs bg-black text-white p-1 font-mono border-2 border-black">
                    animate={`{scale: [1, 1.1, 1], opacity: [1, 0.8, 1], rotate: [0, 1, -1, 0]}`}
                  </code>
                </div>

                {/* Smooth Bounce Animation */}
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      scaleY: [1, 0.95, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: [0.68, -0.55, 0.265, 1.55],
                    }}
                    className="w-20 h-20 bg-[#2d2d2d] border-4 border-black mx-auto flex items-center justify-center shadow-[8px_8px_0px_0px_#000000]"
                  >
                    <Hammer className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="font-bold font-mono text-black tracking-wider">BOUNCE</p>
                  <code className="block text-xs bg-black text-white p-1 font-mono border-2 border-black">
                    animate={`{y: [0, -12, 0], scaleY: [1, 0.95, 1]}`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
