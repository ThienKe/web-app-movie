import CryptoJS from "crypto-js";

export const hashSHA256 = (value) => {
  return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
};
