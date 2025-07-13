import { Fair3ReputationSDK, FAIR3_CONSTANTS } from '../index';

describe('Fair3ReputationSDK', () => {
  let sdk: Fair3ReputationSDK;

  beforeEach(() => {
    sdk = new Fair3ReputationSDK('https://test-api.example.com');
  });

  describe('Constructor', () => {
    it('should initialize with default values', () => {
      const defaultSdk = new Fair3ReputationSDK();
      expect(defaultSdk).toBeInstanceOf(Fair3ReputationSDK);
    });

    it('should initialize with custom base URL', () => {
      const customSdk = new Fair3ReputationSDK('https://custom.api.com');
      expect(customSdk).toBeInstanceOf(Fair3ReputationSDK);
    });
  });

  describe('Utility Methods', () => {
    it('should validate addresses correctly', () => {
      const addresses = [
        '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3', // valid
        '0xinvalid', // invalid
        '742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3', // missing 0x
        '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C' // too short
      ];

      const result = Fair3ReputationSDK.validateAddresses(addresses);
      
      expect(result.valid).toHaveLength(1);
      expect(result.invalid).toHaveLength(3);
      expect(result.valid[0]).toBe('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');
    });

    it('should get tier values correctly', () => {
      expect(Fair3ReputationSDK.getTierValue('Bronze')).toBe(0);
      expect(Fair3ReputationSDK.getTierValue('Silver')).toBe(1);
      expect(Fair3ReputationSDK.getTierValue('Gold')).toBe(2);
      expect(Fair3ReputationSDK.getTierValue('Platinum')).toBe(3);
      expect(Fair3ReputationSDK.getTierValue('Unknown')).toBe(0);
    });

    it('should format scores correctly', () => {
      expect(Fair3ReputationSDK.formatScore(500)).toBe('500');
      expect(Fair3ReputationSDK.formatScore(1500)).toBe('1.5K');
      expect(Fair3ReputationSDK.formatScore(1000000)).toBe('1.0M');
      expect(Fair3ReputationSDK.formatScore(2500000)).toBe('2.5M');
    });
  });

  describe('Wallet Connection', () => {
    it('should handle wallet connection', () => {
      const connection = {
        address: '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
        isConnected: true,
        chainId: 97
      };

      sdk.setWalletConnection(connection);
      expect(sdk.getWalletConnection()).toEqual(connection);
    });

    it('should check wallet readiness', () => {
      expect(sdk.isWalletReady()).toBe(false);

      const connection = {
        address: '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
        isConnected: true,
        chainId: 97
      };

      sdk.setWalletConnection(connection);
      expect(sdk.isWalletReady()).toBe(true);
    });
  });

  describe('Constants', () => {
    it('should export correct constants', () => {
      expect(FAIR3_CONSTANTS.SUPPORTED_CHAINS).toBeDefined();
      expect(FAIR3_CONSTANTS.CONTRACT_ADDRESSES).toBeDefined();
      expect(FAIR3_CONSTANTS.TIER_VALUES).toBeDefined();
      expect(FAIR3_CONSTANTS.API_ENDPOINTS).toBeDefined();
    });

    it('should have correct tier values', () => {
      expect(FAIR3_CONSTANTS.TIER_VALUES.Bronze).toBe(0);
      expect(FAIR3_CONSTANTS.TIER_VALUES.Silver).toBe(1);
      expect(FAIR3_CONSTANTS.TIER_VALUES.Gold).toBe(2);
      expect(FAIR3_CONSTANTS.TIER_VALUES.Platinum).toBe(3);
    });
  });
});
