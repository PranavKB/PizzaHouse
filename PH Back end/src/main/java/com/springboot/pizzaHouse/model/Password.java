package com.springboot.pizzaHouse.model;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.regex.Pattern;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class Password {
    // The higher the number of iterations the more 
    // expensive computing the hash is for us and
    // also for an attacker.
    // Modern security standards (as of 2025)
    private static final int ITERATIONS = 600_000; // Increased for modern hardware
    private static final int SALT_LENGTH = 32;
    private static final int KEY_LENGTH = 256; // Increased key length for better security
    
    // Password must have:
    // - At least 8 characters
    // - At least one digit
    // - At least one lowercase letter
    // - At least one uppercase letter
    // - At least one special character
    private static final Pattern PASSWORD_PATTERN = 
        Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$");

    /**
     * Validates if the password meets security requirements.
     * @param password The password to validate
     * @return true if password meets all requirements, false otherwise
     */
    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Computes a salted PBKDF2 hash of given plaintext password.
     * @param password The password to hash
     * @return String in the format salt$hash
     * @throws Exception if the password is invalid or hashing fails
     */
    public static String getSaltedHash(String password) throws Exception {
        if (!isValidPassword(password)) {
            throw new IllegalArgumentException(
                "Password must be at least 8 characters and contain digits, lowercase, uppercase, and special characters.");
        }
        byte[] salt = SecureRandom.getInstance("SHA1PRNG").generateSeed(SALT_LENGTH);
        return Base64.getEncoder().encodeToString(salt) + "$" + hash(password, salt);
    }

    /**
     * Verifies if a password matches its stored hash.
     * @param password The password to check
     * @param stored The stored password hash in the format salt$hash
     * @return true if password matches, false otherwise
     * @throws Exception if the stored hash is invalid or verification fails
     */
    public static boolean check(String password, String stored) throws Exception {
        if (password == null || stored == null) {
            return false;
        }
        String[] saltAndHash = stored.split("\\$");
        if (saltAndHash.length != 2) {
            throw new IllegalStateException(
                "The stored password must have the form 'salt$hash'");
        }
        String hashOfInput = hash(password, Base64.getDecoder().decode(saltAndHash[0]));
        return hashOfInput.equals(saltAndHash[1]);
    }

    /**
     * Hashes a password using PBKDF2 with HMAC-SHA256.
     * @param password The password to hash
     * @param salt The salt to use
     * @return Base64 encoded hash
     * @throws Exception if hashing fails
     */
    private static String hash(String password, byte[] salt) throws Exception {
        if (password == null || password.length() == 0) {
            throw new IllegalArgumentException("Empty passwords are not supported.");
        }
        SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        SecretKey key = f.generateSecret(new PBEKeySpec(
            password.toCharArray(), salt, ITERATIONS, KEY_LENGTH));
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }
}
