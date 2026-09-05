// Minimal crypto shim for React Native Metro bundler
const webcrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

module.exports = {
  webcrypto,
  getRandomValues: (buffer) => {
    if (globalThis.crypto && globalThis.crypto.getRandomValues) {
      return globalThis.crypto.getRandomValues(buffer);
    }
    return buffer;
  },
};
