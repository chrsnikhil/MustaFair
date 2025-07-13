"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Download,
  Github,
  ExternalLink
} from "lucide-react";

export default function DocsHomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-black font-mono tracking-[0.1em] transform -skew-x-1 text-white mb-4">
              MUSTAFAIR DOCS
            </h1>
            <p className="text-xl text-gray-300 font-mono max-w-3xl mx-auto">
              Complete documentation for integrating CARV ID authentication and reputation systems into your dApps
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="outline" className="bg-white text-black font-mono font-bold">
                v1.3.0
              </Badge>
              <Badge variant="outline" className="bg-green-900 border-green-600 text-green-100 font-mono">
                STABLE
              </Badge>
              <Badge variant="outline" className="bg-blue-900 border-blue-600 text-blue-100 font-mono">
                TYPESCRIPT
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Start */}
        <div className="mb-12">
          <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
            <CardHeader>
              <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Zap className="w-6 h-6" />
                QUICK START
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold font-mono text-white mb-3">Install the SDK</h3>
                  <div className="bg-gray-900 border border-gray-700 p-4 rounded font-mono text-sm">
                    <code className="text-green-400">npm install @mustafair/reputation-sdk</code>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-mono text-white mb-3">Basic Usage</h3>
                  <div className="bg-gray-900 border border-gray-700 p-4 rounded font-mono text-sm">
                    <code className="text-blue-400">
                      {`const sdk = new Fair3ReputationSDK();
const profile = await sdk.getProfile(address);`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Documentation Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* SDK Documentation */}
          <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Code className="w-6 h-6" />
                SDK DOCUMENTATION
              </CardTitle>
              <p className="text-gray-300 font-mono">
                Complete guide for integrating the MustaFair SDK into your applications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Link href="/docs/sdk#installation">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">Installation & Setup</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link href="/docs/sdk#authentication">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">CARV ID Authentication</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link href="/docs/sdk#api-reference">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">API Reference</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link href="/docs/sdk#examples">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">Integration Examples</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </div>
              <div className="pt-4">
                <Link href="/docs/sdk">
                  <Button className="w-full bg-white text-black font-mono font-bold hover:bg-gray-200 border-2 border-white">
                    VIEW SDK DOCS
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Globe className="w-6 h-6" />
                PUBLIC API
              </CardTitle>
              <p className="text-gray-300 font-mono">
                REST API endpoints for accessing reputation and identity data
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Link href="/docs/api#endpoints">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">API Endpoints</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link href="/docs/api#authentication">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">Authentication</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link href="/docs/api#rate-limits">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">Rate Limiting</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link href="/docs/api#examples">
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                    <span className="font-mono text-white">Usage Examples</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </div>
              <div className="pt-4">
                <Link href="/docs/api">
                  <Button className="w-full bg-white text-black font-mono font-bold hover:bg-gray-200 border-2 border-white">
                    VIEW API DOCS
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black border-2 border-gray-600 shadow-[4px_4px_0px_0px_#333]">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                GUIDES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/docs/sdk#installation" className="block text-gray-300 hover:text-white font-mono text-sm">
                  Getting Started Guide
                </Link>
                <Link href="/docs/sdk#react-integration" className="block text-gray-300 hover:text-white font-mono text-sm">
                  React Integration
                </Link>
                <Link href="/docs/sdk#vue-integration" className="block text-gray-300 hover:text-white font-mono text-sm">
                  Vue.js Integration
                </Link>
                <Link href="/docs/sdk#nodejs-integration" className="block text-gray-300 hover:text-white font-mono text-sm">
                  Node.js Backend
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-2 border-gray-600 shadow-[4px_4px_0px_0px_#333]">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                EXAMPLES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/docs/sdk#basic-usage" className="block text-gray-300 hover:text-white font-mono text-sm">
                  Basic SDK Usage
                </Link>
                <Link href="/docs/sdk#authentication" className="block text-gray-300 hover:text-white font-mono text-sm">
                  Authentication Flow
                </Link>
                <Link href="/docs/api#examples" className="block text-gray-300 hover:text-white font-mono text-sm">
                  API Usage Examples
                </Link>
                <Link href="/docs/sdk#examples" className="block text-gray-300 hover:text-white font-mono text-sm">
                  Integration Examples
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-2 border-gray-600 shadow-[4px_4px_0px_0px_#333]">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                RESOURCES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a 
                  href="https://github.com/chrsnikhil/MustaFair" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white font-mono text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
                <a 
                  href="https://www.npmjs.com/package/@mustafair/reputation-sdk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white font-mono text-sm"
                >
                  <Download className="w-4 h-4" />
                  NPM Package
                </a>
                <Link href="/docs/api#overview" className="block text-gray-300 hover:text-white font-mono text-sm">
                  API Overview
                </Link>
                <Link href="/docs/sdk#troubleshooting" className="block text-gray-300 hover:text-white font-mono text-sm">
                  SDK Documentation
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-black to-gray-900 border-2 border-white shadow-[12px_12px_0px_0px_#666]">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-black font-mono text-white mb-4 tracking-wider">
              START BUILDING WITH MUSTAFAIR
            </h2>
            <p className="text-lg text-gray-300 font-mono mb-6 max-w-2xl mx-auto">
              Integrate CARV ID authentication and reputation systems into your dApp in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs/sdk#installation">
                <Button className="bg-white text-black font-mono font-bold hover:bg-gray-200 border-2 border-white px-8 py-3">
                  GET STARTED
                </Button>
              </Link>
              <Link href="/docs/api">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black font-mono font-bold px-8 py-3">
                  VIEW API DOCS
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
