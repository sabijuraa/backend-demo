# Backend Demo

A demonstration project for cryptocurrency exchange integration with Binance API.

## Structure

- `src/exchanges/binance/wallets/spot.js` - Spot wallet price-fetching logic
- `tests/master.test.js` - Test suite for price fetching

## Bug Investigation

This project contains a deliberate bug in the spot price-fetching logic that affects decimal-priced assets.
