import CryptoJS from 'crypto-js';

/**
 * Encrypts text using AES-256.
 * @param data - Sensitive data (passwords, messages)
 * @param key - Secret key (user's password)
 */
export const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

/**
 * Decrypts an AES-256 string.
 * @param ciphertext - Encrypted data from Shelby
 * @param key - Secret key for decryption
 */
export const decryptData = (ciphertext: string, key: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error("Incorrect key");
    return originalText;
  } catch (error) {
    return "Decryption error: Please check your secret key.";
  }
};
