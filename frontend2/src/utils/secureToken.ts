import CryptoJS from "crypto-js";

const encryptToken = (token: string): string => {
  if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
  }
  return CryptoJS.AES.encrypt(
    token,
    process.env.NEXT_PUBLIC_SECRET_KEY
  ).toString();
};

const decryptToken = (encryptedToken: string): string => {
  if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
  }
  return CryptoJS.AES.decrypt(
    encryptedToken,
    process.env.NEXT_PUBLIC_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
};

export { encryptToken, decryptToken };
