/**
 * Spot Wallet - Binance Exchange Integration
 * Handles spot price fetching for various assets
 */

class SpotWallet {
  constructor(binanceClient) {
    this.client = binanceClient;
  }

  /**
   * Fetch the current spot price for an asset
   * @param {string} symbol - Trading pair symbol (e.g., 'BTCUSDT')
   * @returns {Promise<number>} - Current spot price
   */
  async getSpotPrice(symbol) {
    try {
      const response = await this.client.fetchTicker(symbol);
      const price = response.last;
      
      // BUG: parseInt truncates decimal values
      // This causes decimal-priced assets to lose precision
      return parseInt(price);
    } catch (error) {
      throw new Error(`Failed to fetch spot price for ${symbol}: ${error.message}`);
    }
  }

  /**
   * Fetch spot prices for multiple assets
   * @param {string[]} symbols - Array of trading pair symbols
   * @returns {Promise<Object>} - Map of symbol to price
   */
  async getSpotPrices(symbols) {
    const prices = {};
    
    for (const symbol of symbols) {
      prices[symbol] = await this.getSpotPrice(symbol);
    }
    
    return prices;
  }

  /**
   * Get the total value of holdings at current spot prices
   * @param {Object} holdings - Map of symbol to quantity
   * @returns {Promise<number>} - Total value in USDT
   */
  async getTotalValue(holdings) {
    let total = 0;
    
    for (const [symbol, quantity] of Object.entries(holdings)) {
      const price = await this.getSpotPrice(symbol);
      total += price * quantity;
    }
    
    return total;
  }
}

module.exports = SpotWallet;
