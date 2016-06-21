package com.prama.sportingclay.utility;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class EncryptionUtil {

    private static final String PASSWORD_HASH_ALGORITHM = "SHA";

//    public static void main(String[] arg) {
//        String encryptionKey = "d8709fbb-51ad-42dc-a620-d1ea40bae16f";
//        String plainText = "Imliraina4";
//        EncryptionUtil encryptionUtil = new EncryptionUtil();
//        encryptionUtil.encrypt(encryptionKey, plainText);
//        System.out.println("Encrypt Complete");
//        System.out.println("Here it is back:: "+ encryptionUtil.decrypt(encryptionKey, "C6IQWP+ga9RJbrRfabSRfQ=="));
//        System.out.println("Decrypt Complete");
//    }

    private void encrypt(String encryptionKey, String plainText) {
        try {
            byte[] hexBytes = get16ByteKey(encryptionKey);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec key = new SecretKeySpec(hexBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] plainTextInBytes = plainText.getBytes("ASCII");
            byte[] encode = Base64.encodeBase64(cipher.doFinal(plainTextInBytes));

            System.out.println("Encode :: " + new String(encode,"ASCII"));
        } catch(Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    public static String decrypt(String encryptionKey, String encodedText) {
        if(encryptionKey == null || encryptionKey.equals("")) {
            return null;
        }
        try {
            byte[] hexBytes = get16ByteKey(encryptionKey);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec key = new SecretKeySpec(hexBytes, "AES");
            cipher.init(Cipher.DECRYPT_MODE, key);

            byte[] encodedTextInBytes = encodedText.getBytes("ASCII");
            byte[] decode = cipher.doFinal(Base64.decodeBase64(encodedTextInBytes));

            return new String(decode,"ASCII");
        } catch(Throwable throwable) {
            throw new RuntimeException("Password decryption failed :: ", throwable);
        }
    }

    private static byte[] get16ByteKey(String encryptionKey) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest digester = MessageDigest.getInstance(PASSWORD_HASH_ALGORITHM);
        digester.update(String.valueOf(encryptionKey).getBytes("UTF-8"));
        byte[] keyBytes =  digester.digest();
        byte[] strippedKey = Arrays.copyOfRange(keyBytes, 0, 16);
        return strippedKey;
    }
}
