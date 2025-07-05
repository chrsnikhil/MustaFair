import { createConfig, http } from 'wagmi';
import { bscTestnet, localhost } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [bscTestnet, localhost],
  connectors: [metaMask()],
  transports: {
    [bscTestnet.id]: http(),
    [localhost.id]: http(),
  },
}); 