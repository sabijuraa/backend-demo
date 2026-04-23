/**
 * Master Test Suite for Spot Wallet
 */

const SpotWallet = require('../src/exchanges/binance/wallets/spot');

describe('SpotWallet', () => {
  let spotWallet;
  let mockClient;

  beforeEach(() => {
    // Mock the Binance client
    mockClient = {
      fetchTicker: jest.fn(),
    };
    spotWallet = new SpotWallet(mockClient);
  });

  describe('getSpotPrice', () => {
    it('should return the correct price for whole number assets', async () => {
      mockClient.fetchTicker.mockResolvedValue({ last: 50000 });
      
      const price = await spotWallet.getSpotPrice('BTCUSDT');
      
      expect(price).toBe(50000);
    });

    it('should return the correct price for decimal-priced assets', async () => {
      mockClient.fetchTicker.mockResolvedValue({ last: 0.5234 });
      
      const price = await spotWallet.getSpotPrice('SHIBUSDT');
      
      // This test will fail with the buggy implementation (returns 0 instead of 0.5234)
      expect(price).toBe(0.5234);
    });

    it('should handle small decimal prices correctly', async () => {
      mockClient.fetchTicker.mockResolvedValue({ last: 0.00012345 });
      
      const price = await spotWallet.getSpotPrice('DOGEUSDT');
      
      expect(price).toBe(0.00012345);
    });

    it('should throw error on fetch failure', async () => {
      mockClient.fetchTicker.mockRejectedValue(new Error('Network error'));
      
      await expect(spotWallet.getSpotPrice('BTCUSDT')).rejects.toThrow(
        'Failed to fetch spot price for BTCUSDT'
      );
    });
  });

  describe('getTotalValue', () => {
    it('should calculate correct total value with decimal prices', async () => {
      mockClient.fetchTicker.mockImplementation((symbol) => {
        const prices = {
          'ETHUSDT': { last: 2500.75 },
          'SHIBUSDT': { last: 0.0123 },
        };
        return Promise.resolve(prices[symbol]);
      });

      const holdings = {
        'ETHUSDT': 10,        // 10 * 2500.75 = 25007.5
        'SHIBUSDT': 1000000,  // 1000000 * 0.0123 = 12300
      };

      const total = await spotWallet.getTotalValue(holdings);
      
      // Expected: 25007.5 + 12300 = 37307.5
      expect(total).toBeCloseTo(37307.5, 2);
    });
  });
});
