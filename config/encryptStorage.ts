// utils/encryptStorage.ts
import { EncryptStorage } from 'encrypt-storage';

// Pastikan variabel environment sudah diset di .env.local
export const encryptStorage = new EncryptStorage(
  process.env.NEXT_PUBLIC_ENCRYPT_STORAGE_SECRET_KEY!,
  {
    storageType: 'localStorage', // Bisa juga 'sessionStorage' jika perlu
  }
);
