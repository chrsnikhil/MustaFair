"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Terminal,
  HardDrive,
  Cpu,
  Settings,
  Monitor,
  Server,
  Power,
  Code,
  Palette,
  Type,
  Box,
  MousePointer,
} from "lucide-react"

/**
 * MUSTAFAIR BLACK INDUSTRIAL DESIGN SYSTEM
 * Comprehensive Style Guide & Component Library
 *
 * A complete design system for building industrial-grade interfaces
 * with pure black/white contrast and brutalist aesthetics.
 */

export default function MustaFairStyleGuide() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative p-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h1
            className="text-7xl font-black text-white font-mono tracking-[0.2em] mb-4 transform -skew-x-1"
            style={{ textShadow: "4px 4px 0px #666, 8px 8px 0px #999" }}
          >
            MUSTAFAIR
            <br />
            <span className="text-5xl tracking-[0.3em] text-[#d1d5db]">DESIGN SYSTEM</span>
          </h1>
          <div className="bg-white text-black px-8 py-3 inline-block transform skew-x-1 border-4 border-white shadow-[6px_6px_0px_0px_#666] font-mono font-black tracking-[0.2em]">
            BLACK INDUSTRIAL • BRUTALIST • UNCOMPROMISING
          </div>
        </motion.div>

        {/* Design Tokens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
                <Palette className="w-8 h-8" />
                DESIGN TOKENS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Colors */}
              <div>
                <h3 className="text-2xl font-black font-mono text-white mb-4 tracking-wider">COLOR SYSTEM</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "PRIMARY BLACK", value: "#000000", class: "bg-black", text: "text-white" },
                    { name: "DEEP BLACK", value: "#0a0a0a", class: "bg-[#0a0a0a]", text: "text-white" },
                    {
                      name: "PURE WHITE",
                      value: "#ffffff",
                      class: "bg-white border border-gray-400",
                      text: "text-black",
                    },
                    { name: "LIGHT GRAY", value: "#d1d5db", class: "bg-[#d1d5db]", text: "text-black" },
                    { name: "MEDIUM GRAY", value: "#999999", class: "bg-[#999999]", text: "text-white" },
                    { name: "DARK GRAY", value: "#666666", class: "bg-[#666666]", text: "text-white" },
                    { name: "SHADOW GRAY", value: "#333333", class: "bg-[#333333]", text: "text-white" },
                    { name: "ACCENT GRAY", value: "#222222", class: "bg-[#222222]", text: "text-white" },
                  ].map((color, index) => (
                    <motion.div
                      key={color.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center group cursor-pointer"
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <div
                        className={`w-full h-20 ${color.class} border-3 border-white shadow-[4px_4px_0px_0px_#666] mb-2 group-hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-300`}
                      />
                      <p className="text-xs font-bold font-mono text-white tracking-wider">{color.name}</p>
                      <code className="text-xs font-mono bg-white text-black px-2 py-1 border border-white">
                        {color.value}
                      </code>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Spacing System */}
              <div>
                <h3 className="text-2xl font-black font-mono text-white mb-4 tracking-wider">SPACING SCALE</h3>
                <div className="space-y-3">
                  {[
                    { name: "XS", value: "4px", class: "w-1" },
                    { name: "SM", value: "8px", class: "w-2" },
                    { name: "MD", value: "16px", class: "w-4" },
                    { name: "LG", value: "24px", class: "w-6" },
                    { name: "XL", value: "32px", class: "w-8" },
                    { name: "2XL", value: "48px", class: "w-12" },
                    { name: "3XL", value: "64px", class: "w-16" },
                  ].map((space) => (
                    <div key={space.name} className="flex items-center gap-4">
                      <div
                        className={`${space.class} h-4 bg-white border-2 border-white shadow-[2px_2px_0px_0px_#666]`}
                      />
                      <code className="font-mono text-white text-sm">
                        {space.name}: {space.value}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shadow System */}
              <div>
                <h3 className="text-2xl font-black font-mono text-white mb-4 tracking-wider">SHADOW SYSTEM</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "SMALL", value: "shadow-[4px_4px_0px_0px_#666]", class: "shadow-[4px_4px_0px_0px_#666]" },
                    { name: "MEDIUM", value: "shadow-[8px_8px_0px_0px_#666]", class: "shadow-[8px_8px_0px_0px_#666]" },
                    {
                      name: "LARGE",
                      value: "shadow-[12px_12px_0px_0px_#666]",
                      class: "shadow-[12px_12px_0px_0px_#666]",
                    },
                    {
                      name: "XLARGE",
                      value: "shadow-[16px_16px_0px_0px_#666]",
                      class: "shadow-[16px_16px_0px_0px_#666]",
                    },
                    {
                      name: "HERO",
                      value: "shadow-[20px_20px_0px_0px_#666]",
                      class: "shadow-[20px_20px_0px_0px_#666]",
                    },
                    {
                      name: "MASSIVE",
                      value: "shadow-[24px_24px_0px_0px_#666]",
                      class: "shadow-[24px_24px_0px_0px_#666]",
                    },
                  ].map((shadow) => (
                    <div key={shadow.name} className="text-center">
                      <div className={`w-full h-16 bg-white border-4 border-white ${shadow.class} mb-2`} />
                      <p className="text-xs font-bold font-mono text-white">{shadow.name}</p>
                      <code className="text-xs font-mono text-[#d1d5db] block">{shadow.value}</code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Typography System */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
                <Type className="w-8 h-8" />
                TYPOGRAPHY SYSTEM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                {[
                  {
                    name: "HERO",
                    class: "text-7xl font-black font-mono tracking-[0.2em] transform -skew-x-1 text-white",
                    text: "HERO HEADING",
                    code: "text-7xl font-black font-mono tracking-[0.2em] transform -skew-x-1",
                  },
                  {
                    name: "H1",
                    class: "text-6xl font-black font-mono tracking-[0.1em] transform -skew-x-1 text-white",
                    text: "HEADING 1",
                    code: "text-6xl font-black font-mono tracking-[0.1em] transform -skew-x-1",
                  },
                  {
                    name: "H2",
                    class: "text-4xl font-bold font-mono tracking-wider transform skew-x-1 text-white",
                    text: "HEADING 2",
                    code: "text-4xl font-bold font-mono tracking-wider transform skew-x-1",
                  },
                  {
                    name: "H3",
                    class: "text-2xl font-black font-mono tracking-wider text-white",
                    text: "HEADING 3",
                    code: "text-2xl font-black font-mono tracking-wider",
                  },
                  {
                    name: "BODY",
                    class: "text-lg font-medium text-[#d1d5db] font-mono tracking-wide",
                    text: "BODY TEXT FOR INDUSTRIAL INTERFACES",
                    code: "text-lg font-medium text-[#d1d5db] font-mono tracking-wide",
                  },
                  {
                    name: "CAPTION",
                    class:
                      "text-sm font-mono font-bold text-white tracking-[0.2em] bg-black px-2 py-1 inline-block border border-white",
                    text: "TECHNICAL CAPTION",
                    code: "text-sm font-mono font-bold tracking-[0.2em] bg-black border border-white",
                  },
                ].map((typo) => (
                  <div key={typo.name} className="space-y-2">
                    <div
                      className={typo.class}
                      style={{
                        textShadow:
                          typo.name === "HERO" || typo.name === "H1" ? "3px 3px 0px #666, 6px 6px 0px #999" : "none",
                      }}
                    >
                      {typo.text}
                    </div>
                    <code className="block text-sm bg-white text-black p-3 font-mono border-2 border-white">
                      {typo.code}
                    </code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Component Library */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
                <Box className="w-8 h-8" />
                COMPONENT LIBRARY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-12">
              {/* Buttons */}
              <div>
                <h3 className="text-2xl font-black font-mono text-white mb-6 tracking-wider">BUTTON COMPONENTS</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Primary Button */}
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-white hover:bg-[#e8e8e8] text-black font-black font-mono px-8 py-4 border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 tracking-wider transform -skew-x-1">
                        <Terminal className="mr-2 h-5 w-5" />
                        PRIMARY
                      </Button>
                    </motion.div>
                    <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                      bg-white border-4 shadow-[8px_8px_0px_0px_#666] transform -skew-x-1
                    </code>
                  </div>

                  {/* Secondary Button */}
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="bg-black border-4 border-white text-white hover:bg-[#1a1a1a] font-black font-mono px-8 py-4 shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 tracking-wider transform skew-x-1"
                      >
                        <HardDrive className="mr-2 h-5 w-5" />
                        SECONDARY
                      </Button>
                    </motion.div>
                    <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                      bg-black border-4 border-white transform skew-x-1
                    </code>
                  </div>

                  {/* Icon Button */}
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-black hover:bg-[#1a1a1a] text-white font-black font-mono p-4 border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300">
                        <Settings className="h-6 w-6" />
                      </Button>
                    </motion.div>
                    <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                      bg-black border-4 border-white p-4 (icon only)
                    </code>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-2xl font-black font-mono text-white mb-6 tracking-wider">CARD COMPONENTS</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Feature Card */}
                  <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}>
                    <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-400 group">
                      <CardContent className="p-6 space-y-4">
                        <motion.div
                          className="w-16 h-16 bg-black border-4 border-white flex items-center justify-center shadow-[6px_6px_0px_0px_#666] transform -skew-x-1"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Cpu className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-black text-white font-mono tracking-wider">FEATURE CARD</h3>
                        <p className="text-[#d1d5db] font-mono font-medium tracking-wide">
                          Industrial description with monospace styling for technical interfaces.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Status Card */}
                  <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}>
                    <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-400 relative before:absolute before:top-2 before:right-2 before:w-6 before:h-6 before:bg-white before:transform before:rotate-45">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-12 h-12 bg-black border-3 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#666]"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Power className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-mono font-black text-lg text-white">STATUS CARD</h3>
                            <p className="font-mono text-sm text-[#d1d5db]">SYSTEM OPERATIONAL</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between font-mono text-sm text-white">
                            <span>LOAD</span>
                            <span>23%</span>
                          </div>
                          <div className="w-full h-3 bg-black border-2 border-white">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "23%" }}
                              transition={{ duration: 1.5 }}
                              className="h-full bg-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                <code className="block text-sm bg-white text-black p-3 font-mono border-2 border-white mt-4">
                  bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666]
                </code>
              </div>

              {/* Form Elements */}
              <div>
                <h3 className="text-2xl font-black font-mono text-white mb-6 tracking-wider">FORM COMPONENTS</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Input
                        placeholder="ENTER COMMAND..."
                        className="bg-black border-3 border-white text-white placeholder:text-[#666] font-mono shadow-[4px_4px_0px_0px_#666] focus:shadow-[6px_6px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300 focus:border-[#d1d5db] focus:outline-none focus:ring-0 transform skew-x-1"
                      />
                      <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                        bg-black border-3 border-white font-mono transform skew-x-1
                      </code>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge className="bg-white text-black font-bold font-mono px-4 py-2 border-3 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[4px_4px_0px_0px_#666] transition-all duration-200 tracking-wider cursor-pointer">
                            ACTIVE
                          </Badge>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge
                            variant="outline"
                            className="bg-black hover:bg-[#1a1a1a] border-3 border-white text-white font-bold font-mono px-4 py-2 shadow-[3px_3px_0px_0px_#666] hover:shadow-[4px_4px_0px_0px_#666] transition-all duration-200 tracking-wider cursor-pointer"
                          >
                            INACTIVE
                          </Badge>
                        </motion.div>
                      </div>
                      <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                        border-3 border-white shadow-[3px_3px_0px_0px_#666] font-mono
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Animation Presets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
                <MousePointer className="w-8 h-8" />
                ANIMATION PRESETS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Hover Lift */}
                <div className="text-center space-y-4">
                  <motion.div
                    className="w-20 h-20 bg-white border-4 border-white mx-auto flex items-center justify-center shadow-[8px_8px_0px_0px_#666] cursor-pointer"
                    whileHover={{ y: -8, scale: 1.05, shadow: "12px_12px_0px_0px_#666" }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Monitor className="w-10 h-10 text-black" />
                  </motion.div>
                  <p className="font-bold font-mono text-white tracking-wider">HOVER LIFT</p>
                  <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                    whileHover={`{{ y: -8, scale: 1.05 }}`}
                  </code>
                </div>

                {/* Rotate Scale */}
                <div className="text-center space-y-4">
                  <motion.div
                    className="w-20 h-20 bg-black border-4 border-white mx-auto flex items-center justify-center shadow-[8px_8px_0px_0px_#666] cursor-pointer"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Settings className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="font-bold font-mono text-white tracking-wider">ROTATE SCALE</p>
                  <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                    whileHover={`{{ rotate: 360, scale: 1.1 }}`}
                  </code>
                </div>

                {/* Continuous Float */}
                <div className="text-center space-y-4">
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
                    className="w-20 h-20 bg-black border-4 border-white mx-auto flex items-center justify-center shadow-[8px_8px_0px_0px_#666]"
                  >
                    <Server className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="font-bold font-mono text-white tracking-wider">CONTINUOUS FLOAT</p>
                  <code className="block text-xs bg-white text-black p-2 font-mono border-2 border-white">
                    animate={`{{y: [0, -8, 0], rotate: [0, 2, -2, 0]}}`}
                  </code>
                </div>
              </div>

              {/* Easing Functions */}
              <div>
                <h3 className="text-xl font-black font-mono text-white mb-4 tracking-wider">EASING PRESETS</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <code className="bg-white text-black p-3 font-mono border-2 border-white">
                    // Smooth Industrial
                    <br />
                    ease: [0.25, 0.46, 0.45, 0.94]
                  </code>
                  <code className="bg-white text-black p-3 font-mono border-2 border-white">
                    // Bounce Effect
                    <br />
                    ease: [0.68, -0.55, 0.265, 1.55]
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
                <Code className="w-8 h-8" />
                USAGE GUIDELINES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-black font-mono text-white mb-4 tracking-wider text-green-400">✓ DO</h3>
                  <ul className="space-y-3 text-[#d1d5db] font-mono">
                    <li>• Use pure black (#000000) for primary surfaces</li>
                    <li>• Apply white borders (4px) for maximum contrast</li>
                    <li>• Use monospace fonts for all text</li>
                    <li>• Apply skew transforms for brutalist effect</li>
                    <li>• Use box shadows for depth (no blur)</li>
                    <li>• Implement smooth hover animations</li>
                    <li>• Maintain high contrast ratios</li>
                    <li>• Use uppercase text for headings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-black font-mono text-white mb-4 tracking-wider text-red-400">✗ DON'T</h3>
                  <ul className="space-y-3 text-[#d1d5db] font-mono">
                    <li>• Use gradients or soft colors</li>
                    <li>• Apply rounded corners</li>
                    <li>• Use serif or script fonts</li>
                    <li>• Create low contrast combinations</li>
                    <li>• Use blurred or soft shadows</li>
                    <li>• Implement slow or bouncy animations</li>
                    <li>• Mix color schemes</li>
                    <li>• Use lowercase for important text</li>
                  </ul>
                </div>
              </div>

              {/* Code Examples */}
              <div>
                <h3 className="text-xl font-black font-mono text-white mb-4 tracking-wider">IMPLEMENTATION EXAMPLES</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono font-bold text-white mb-2">Basic Card Component:</h4>
                    <code className="block bg-white text-black p-4 font-mono text-sm border-2 border-white overflow-x-auto">
                      {`<Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] 
                 hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-400">
  <CardContent className="p-6">
    <h3 className="font-mono font-black text-white tracking-wider">TITLE</h3>
    <p className="text-[#d1d5db] font-mono">Description text</p>
  </CardContent>
</Card>`}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-white mb-2">Animated Button:</h4>
                    <code className="block bg-white text-black p-4 font-mono text-sm border-2 border-white overflow-x-auto">
                      {`<motion.div whileHover={{ y: -8, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button className="bg-white text-black font-black font-mono px-8 py-4 
                     border-4 border-white shadow-[8px_8px_0px_0px_#666] 
                     hover:shadow-[12px_12px_0px_0px_#666] transform -skew-x-1">
    BUTTON TEXT
  </Button>
</motion.div>`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
