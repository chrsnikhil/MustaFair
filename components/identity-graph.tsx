'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Network,
  Wallet,
  Github,
  User,
  Hash,
  Shield,
  Zap,
  Link2,
  Globe,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useIdentityWalletBinding } from '@/hooks/use-identity-wallet-binding';
import { useSession } from 'next-auth/react';
import { usePrivy } from '@privy-io/react-auth';

interface IdentityNode {
  id: string;
  type: 'wallet' | 'github' | 'identity' | 'carv' | 'reputation';
  label: string;
  value?: string;
  status: 'connected' | 'pending' | 'disconnected';
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface IdentityLink {
  source: string;
  target: string;
  type: 'primary' | 'secondary' | 'data';
  strength: number;
}

export function IdentityGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<IdentityNode | null>(null);
  const { identityHash, walletAddress, isLinked } = useIdentityWalletBinding();
  const { data: session } = useSession();
  const { user, authenticated } = usePrivy();

  // Update nodes based on actual connection states
  const [nodes, setNodes] = useState<IdentityNode[]>([]);

  useEffect(() => {
    // Get actual GitHub/Google connection status from session
    const githubConnected = session?.identityData?.provider === 'github';
    const googleConnected = session?.identityData?.provider === 'google';
    const hasOAuthProvider = githubConnected || googleConnected;
    
    const updatedNodes: IdentityNode[] = [
      {
        id: 'identity',
        type: 'identity',
        label: 'IDENTITY CORE',
        value: identityHash || 'Not Generated',
        status: identityHash ? 'connected' : 'pending',
      },
      {
        id: 'wallet',
        type: 'wallet',
        label: 'WALLET',
        value: walletAddress || 'Not Connected',
        status: walletAddress ? 'connected' : 'disconnected',
      },
      {
        id: 'github',
        type: 'github',
        label: githubConnected ? 'GITHUB' : googleConnected ? 'GOOGLE' : 'OAUTH',
        value: session?.identityData?.email || session?.identityData?.name || 'Not Connected',
        status: hasOAuthProvider ? 'connected' : 'disconnected',
      },
      {
        id: 'carv',
        type: 'carv',
        label: 'CARV ID',
        value: 'ERC-7231 Token',
        status: isLinked ? 'connected' : 'pending',
      },
      {
        id: 'reputation',
        type: 'reputation',
        label: 'REP-NFT',
        value: 'Bronze Tier',
        status: 'pending',
      },
    ];

    setNodes(updatedNodes);
  }, [identityHash, walletAddress, isLinked, session, user, authenticated]);

  const links: IdentityLink[] = [
    { source: 'identity', target: 'wallet', type: 'primary', strength: 1 },
    { source: 'identity', target: 'github', type: 'secondary', strength: 0.8 },
    { source: 'identity', target: 'carv', type: 'primary', strength: 1 },
    { source: 'carv', target: 'reputation', type: 'data', strength: 0.6 },
    { source: 'wallet', target: 'carv', type: 'secondary', strength: 0.7 },
  ];

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create copies of nodes and links to avoid mutation issues
    const nodesCopy = nodes.map(node => ({ ...node }));
    const linksCopy = links.map(link => ({ ...link }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodesCopy as any)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('collision', d3.forceCollide().radius(50));

    // Add link force after nodes are initialized
    simulation.force(
      'link',
      d3
        .forceLink(linksCopy)
        .id((d: any) => d.id)
        .distance(100)
        .strength((d: any) => d.strength)
    );

    // Create gradient definitions for industrial effects
    const defs = svg.append('defs');

    // Glowing effect for connections
    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background grid pattern
    const pattern = defs
      .append('pattern')
      .attr('id', 'grid')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');

    pattern
      .append('path')
      .attr('d', 'M 20 0 L 0 0 0 20')
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3);

    // Background
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0a0a0a')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3);

    svg
      .append('rect')
      .attr('width', width - 6)
      .attr('height', height - 6)
      .attr('x', 3)
      .attr('y', 3)
      .attr('fill', 'url(#grid)')
      .attr('opacity', 0.4);

    // Create links
    const linkGroup = svg.append('g').attr('class', 'links');

    const linkElements = linkGroup
      .selectAll('line')
      .data(linksCopy)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        switch (d.type) {
          case 'primary':
            return '#ffffff';
          case 'secondary':
            return '#d1d5db';
          case 'data':
            return '#999999';
          default:
            return '#666666';
        }
      })
      .attr('stroke-width', (d) => (d.type === 'primary' ? 3 : 2))
      .attr('stroke-dasharray', (d) => (d.type === 'data' ? '5,5' : 'none'))
      .attr('filter', 'url(#glow)')
      .style('opacity', 0.8);

    // Create connection particles
    const particleGroup = svg.append('g').attr('class', 'particles');

    // Store particle animations to start after simulation settles
    const particleAnimations: (() => void)[] = [];

    // Create nodes
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    const nodeElements = nodeGroup
      .selectAll('g')
      .data(nodesCopy)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<any, any>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    // Node backgrounds with industrial styling
    nodeElements
      .append('rect')
      .attr('width', 80)
      .attr('height', 60)
      .attr('x', -40)
      .attr('y', -30)
      .attr('fill', '#000000')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('rx', 0)
      .style('filter', 'drop-shadow(4px 4px 0px #666666)');

    // Status indicators
    nodeElements
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('x', 30)
      .attr('y', -25)
      .attr('fill', (d) => {
        switch (d.status) {
          case 'connected':
            return '#ffffff';
          case 'pending':
            return '#999999';
          case 'disconnected':
            return '#333333';
          default:
            return '#666666';
        }
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1);

    // Node icons
    nodeElements
      .append('foreignObject')
      .attr('width', 24)
      .attr('height', 24)
      .attr('x', -12)
      .attr('y', -20)
      .append('xhtml:div')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('color', '#ffffff')
      .html((d) => {
        const iconMap = {
          identity: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M16 18v-2a4 4 0 0 0-8 0v2"/></svg>',
          wallet: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
          github: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
          carv: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
          reputation: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
        };
        return iconMap[d.type] || '';
      });

    // Node labels
    nodeElements
      .append('text')
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-family', 'monospace')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d) => d.label);

    // Node click handler
    nodeElements.on('click', (event, d) => {
      setSelectedNode(d);
    });

    // Create particle animations for primary links
    linksCopy.forEach((link, i) => {
      if (link.type === 'primary') {
        const particle = particleGroup
          .append('circle')
          .attr('r', 2)
          .attr('fill', '#ffffff')
          .attr('filter', 'url(#glow)')
          .style('opacity', 0);

        const animateParticle = () => {
          const sourceNode = nodesCopy.find((n) => n.id === link.source) as any;
          const targetNode = nodesCopy.find((n) => n.id === link.target) as any;
          
          if (sourceNode && targetNode && sourceNode.x !== undefined && targetNode.x !== undefined) {
            particle
              .style('opacity', 1)
              .attr('cx', sourceNode.x)
              .attr('cy', sourceNode.y)
              .transition()
              .duration(2000 + i * 500)
              .ease(d3.easeLinear)
              .attr('cx', targetNode.x)
              .attr('cy', targetNode.y)
              .on('end', () => {
                // Only continue if nodes still have positions
                if (sourceNode.x !== undefined && targetNode.x !== undefined) {
                  animateParticle();
                }
              });
          } else {
            // Retry after a short delay if nodes aren't positioned yet
            setTimeout(animateParticle, 100);
          }
        };

        particleAnimations.push(() => setTimeout(animateParticle, i * 1000 + 1000));
      }
    });

    // Update positions on simulation tick
    let particlesStarted = false;
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeElements.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      // Start particle animations once nodes are positioned
      if (!particlesStarted && simulation.alpha() < 0.3) {
        particlesStarted = true;
        particleAnimations.forEach(animate => animate());
      }
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes]);

  const togglePrivacyMode = () => {
    setIsPrivacyMode(!isPrivacyMode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-white text-black';
      case 'pending':
        return 'bg-[#999999] text-white';
      case 'disconnected':
        return 'bg-[#333333] text-white';
      default:
        return 'bg-[#666666] text-white';
    }
  };

  const maskValue = (value: string) => {
    if (!isPrivacyMode) return value;
    if (value.length > 10) {
      return `${value.slice(0, 6)}...${value.slice(-4)}`;
    }
    return '••••••••';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
              <Network className="w-8 h-8" />
              IDENTITY GRAPH MATRIX
            </CardTitle>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={togglePrivacyMode}
                className="bg-black hover:bg-[#1a1a1a] text-white font-mono font-bold border-2 border-white shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-300"
              >
                {isPrivacyMode ? (
                  <Eye className="w-4 h-4 mr-2" />
                ) : (
                  <EyeOff className="w-4 h-4 mr-2" />
                )}
                {isPrivacyMode ? 'SHOW' : 'HIDE'}
              </Button>
            </motion.div>
          </div>
          <p className="text-[#d1d5db] font-mono text-sm tracking-wide">
            VISUALIZING MODULAR IDENTITY CONNECTIONS • ERC-7231 COMPLIANT
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Graph Visualization */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0a0a0a] border-2 border-white shadow-[8px_8px_0px_0px_#666] p-4"
            >
              <svg
                ref={svgRef}
                width="100%"
                height="400"
                viewBox="0 0 600 400"
                className="w-full"
              />
            </motion.div>

            {/* Status Overlay - Improved Layout */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge className="bg-white text-black font-mono text-xs px-3 py-1 border-2 border-white shadow-[3px_3px_0px_0px_#666] transform -skew-x-1">
                LIVE NETWORK
              </Badge>
            </div>
            
            <div className="absolute top-4 right-4">
              <Badge className="bg-black text-white font-mono text-xs px-3 py-1 border-2 border-white shadow-[3px_3px_0px_0px_#666] transform -skew-x-1">
                {nodes.filter((n) => n.status === 'connected').length}/{nodes.length} LINKED
              </Badge>
            </div>
          </div>

          {/* Node Details Panel */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black border-2 border-white p-4 shadow-[4px_4px_0px_0px_#666]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono font-black text-white text-lg tracking-wider">
                  {selectedNode.label}
                </h3>
                <Badge className={`font-mono text-xs px-2 py-1 ${getStatusColor(selectedNode.status)}`}>
                  {selectedNode.status.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#d1d5db]" />
                  <span className="text-[#d1d5db] font-mono text-sm">
                    {maskValue(selectedNode.value || 'N/A')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#d1d5db]" />
                  <span className="text-[#d1d5db] font-mono text-sm">
                    TYPE: {selectedNode.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setSelectedNode(null)}
                className="mt-3 bg-white text-black hover:bg-[#d1d5db] font-mono font-bold text-xs px-3 py-1 border border-white shadow-[2px_2px_0px_0px_#666]"
              >
                CLOSE
              </Button>
            </motion.div>
          )}

          {/* Connection Status Grid */}
          <div className="space-y-4">
            <h4 className="text-white font-mono font-black text-sm tracking-wider border-b-2 border-white pb-2">
              IDENTITY COMPONENTS
            </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-black border-2 border-white p-3 shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 ${getStatusColor(node.status)} border border-white`} />
                  <span className="text-white font-mono text-xs font-bold tracking-wider">
                    {node.label}
                  </span>
                </div>
                <p className="text-[#d1d5db] font-mono text-xs truncate">
                  {maskValue(node.value || 'N/A')}
                </p>
              </motion.div>
            ))}
            </div>
          </div>

          {/* System Information */}
          <div className="bg-black border-2 border-[#d1d5db] p-4 shadow-[4px_4px_0px_0px_#666]">
            <h4 className="text-white font-mono font-black text-sm mb-2 tracking-wider">
              SYSTEM STATUS
            </h4>
            <div className="space-y-1 text-xs font-mono text-[#d1d5db]">
              <div>PROTOCOL: ERC-7231 MODULAR IDENTITY</div>
              <div>NETWORK: BNB TESTNET</div>
              <div>PRIVACY: {isPrivacyMode ? 'ENABLED' : 'DISABLED'}</div>
              <div>GRAPH NODES: {nodes.length} | CONNECTIONS: {links.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
