
/**
 * Base64 encode an array of bytes
 * 
 * @param {*} buf - Array to be Base64 encoded
 */
function arrayToBase64(buf) {
    return btoa(new Uint8Array(buf).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
    },
        '')
    );
}

/**
 * Base64 decode into an array of bytes
 * 
 * @param {string} b64 - A base64 encoded string 
 */
function base64ToArray(b64) {
    let asciiString = atob(b64);
    return new Uint8Array([...asciiString].map(char => char.charCodeAt(0)));
}

/**
 * Base64Url decode into an array of bytes
 * 
 * @param {string} input 
 */
function base64UrlToBuf(input) {
    return (base64ToArray(urlToBase64(input)));
}

/**
 * Base64Url encode an array of bytes
 * 
 * @param {*} input - Array of bytes to be encoded
 */
function bufToBase64Url(input) {
    return (base64ToUrl(arrayToBase64(input)));
}

/**
 * Converts a plain Base64 string into a Base64Url string
 * 
 * @param {string} input - A Base64 encoded string 
 */
function base64ToUrl(input) {
    input = input
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/\=/g, '');
    return input;
}

/**
 * Converts a Base64Url string into a plain Base64 string.
 * 
 * @param {string} input - A Base64Url encoded string
 */
function urlToBase64(input) {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        input += new Array(5 - pad).join('=');
    }

    return input;
}

/**
 * Converts an array of bytes into a HEX encoded string
 * 
 * @param {*} buffer - The byte array to encode
 */
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/**
 * Creates a new HMAC key using SHA-256 as the underlying checksum algorithm
 */
async function generateHmacKey() {
    return window.crypto.subtle.generateKey(
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        true, //extractable
        ["sign", "verify"]
    )
}

/**
 * Creates a Hashed Message Authentication Code (HMAC) from the supplied message.
 * 
 * @param {*} key - The key used to create a HMAC from the message
 * @param {*} message - The message to compute the HMAC from
 */
async function getHmacBase64Url(key, message) {
    let enc = new TextEncoder();
    let buf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    return bufToBase64Url(buf);
}

/**
 * Validates the HMAC signature of a message using the supplied key
 * 
 * @param {*} key - The secret key used for both creation and validation of message signatures
 * @param {*} sigB64 - The Base64Url encoded signature to be verified
 * @param {*} message - The original message that produced the signature
 */
async function validateHmacBase64Url(key, sigB64, message) {
    let signature = base64UrlToBuf(sigB64);
    let algorithm = "HMAC";
    let data = new TextEncoder().encode(message);
    return crypto.subtle.verify(algorithm, key, signature, data);
}

/**
 * Creates a Base64Url encoded fingerprint from a message using the SHA-1 algorithm
 * 
 * @param {string} message - The message to process
 */
async function getSha1Base64Url(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    let buf = await crypto.subtle.digest("SHA-1", data);
    return bufToBase64Url(buf);
}

/**
 * Generate an EC keypair suitable for Elliptic Curve Diffie-Hellman key exchange
 * based on the P-384 curve defined by NIST
 */
function generateECKey() {
    return window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-384",
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
    );
}

/**
 * Derives a shared secret resulting from a completed EC Diffie-Hellman key exchange
 * 
 * @param {*} publicKey - The other parties public EC P-384 key
 * @param {*} privateKey - My private EC p-384 key
 */
function deriveSharedKey(publicKey, privateKey) {
    return window.crypto.subtle.deriveKey(
        {
            name: "ECDH",
            namedCurve: "P-384", // alternatives:  "P-256" or "P-521"
            public: publicKey, // ECDH public key from other party
        },
        privateKey, //your ECDH private key
        { // Derived key type
            name: "AES-GCM", //can be any AES algorithm ("AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC")
            length: 256, //can be  128, 192, or 256
        },
        true, // extractable, can be used in exportKey
        ["encrypt", "decrypt"] // Key usage
    );
    // Promise resolves to CryptoKey
}

/**
 * Uses ECDH with the P-384 curve to derive a 256 bit AES key to be used for AES-GCM 
 * encryption/decryption.
 * 
 * @param {string} theirPubKeyB64Raw - Base64Url encoded public key in raw format
 * @param {string} myPrivKeyB64Pkcs8 - Base64Url encoded private key in PKCS8 format
 */
async function decodeAndDerive(theirPubKeyB64Raw, myPrivKeyB64Pkcs8) {
    let pubkey_raw = base64UrlToBuf(theirPubKeyB64Raw);
    console.log("reading raw public key", theirPubKeyB64Raw)
    let pubkey = await crypto.subtle.importKey(
        "raw",
        pubkey_raw,
        {
            name: "ECDH",
            namedCurve: "P-384",
        },
        true,
        []);
    console.log("public key", pubkey)
    let privkey_raw = base64UrlToBuf(myPrivKeyB64Pkcs8);
    let privkey = await crypto.subtle.importKey(
        "pkcs8",
        privkey_raw,
        {
            name: "ECDH",
            namedCurve: "P-384",
        },
        true,
        ["deriveKey", "deriveBits"]);

    let secret = await deriveSharedKey(pubkey, privkey)
    return secret;
}

/**
 * Checks if two keys are equal by value by encoding them and comparing the results
 * 
 * @param {*} key1
 * @param {*} key2 
 */
async function isEqual(key1, key2) {
    let jwk1 = JSON.stringify(await keyToJWK(key1));
    let jwk2 = JSON.stringify(await keyToJWK(key2));
    return jwk1 == jwk2;
}

/**
 * Encode/export a key into JWK (JSON Web Key) format
 * 
 * @param {*} keydata - The native key to encode
 */
function keyToJWK(keydata) {
    return window.crypto.subtle.exportKey("jwk", keydata)
    // Promise resolves to a JSON object
}

/**
 * Generate 16 bytes of secure random data to be used as an Initialization Vector
 * suitable for AES encryption 
 */
function generateIV() {
    return window.crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Encrypt a plain text message using AES-GCM with the supplied key and IV
 * 
 * @param {*} message - Plaintext message to encrypt
 * @param {*} iv - The Initialization Vector to be used
 * @param {*} key - The AES key used for encryption
 */
function encryptMessage(message, iv, key) {
    let enc = new TextEncoder();
    return window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        enc.encode(message)
    );
}

/**
 * Decrypt a ciphertext message into a plaintext string using AES-GCM with the
 * supplied key and IV.
 * 
 * @param {*} ciphertext - The ciphertext buffer to decrypt
 * @param {*} iv - The Initialization Vector to be used
 * @param {*} key - The AES key used for decryption
 * 
 * @returns - A promise resolving to an ArrayBuffer with the plaintext
 */
function decryptMessage(ciphertext, iv, key) {
    return window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        ciphertext
    );
}

/**
 * Converts an array of bytes into a string of ASCII characters.
 * 
 * @param {*} buffer - An array of bytes
 * 
 * @returns - A string representation of the bytes in the array
 */
function arrayBufferToString(buffer) {
    let result = "";
    let arr = new Uint8Array(buffer);
    for (let i = 0; i < arr.length; i++) {
        result += String.fromCharCode(arr[i]);
    }
    return result;
}

function arrayBufferToString2(buffer) {
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if (/[\u0080-\uffff]/.test(str)) {
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}


async function demo() {
    let alice_key = await generateECKey();
    console.log("Alice's private key: ", await keyToJWK(alice_key.privateKey));
    let alice_pub = alice_key.publicKey;
    let alice_priv = alice_key.privateKey;
    let bob_key = await generateECKey();
    let bob_pub = bob_key.publicKey;
    let bob_priv = bob_key.privateKey;
    let alice_secret = await deriveSharedKey(bob_pub, alice_priv)
    let bob_secret = await deriveSharedKey(alice_pub, bob_priv)
    console.log("Alice's secret", await keyToJWK(alice_secret));
    console.log("Bob's secret", await keyToJWK(bob_secret));
    console.log("They are the same: ", await isEqual(alice_secret, bob_secret));
    let iv = generateIV();
    let encrypted = await encryptMessage("Hello from the other side...", iv, alice_secret);
    console.log("Encrypted raw", encrypted);
    let encrypted_b64 = bufToBase64Url(encrypted);
    console.log("Encrypted b64", encrypted_b64);
    console.log("IV: ", bufToBase64Url(iv));
    let decrypted = await decryptMessage(base64UrlToBuf(encrypted_b64), iv, bob_secret);
    console.log("Decrypted: ", arrayBufferToString(decrypted));
    let hmac_key = await generateHmacKey();
    console.log("HMAC key", hmac_key);
    let hmac_signature = await getHmacBase64Url(hmac_key, "Message to Sign");
    console.log("HMAC Base64Url encoded", hmac_signature);
    console.log("HMAC verified", await validateHmacBase64Url(hmac_key, hmac_signature, "Message to Sign"));
}

/**
 * Cleanup old keys from local storage
 */
function removeOldKeys(maxage = 3600 * 48) {
    let store = window.localStorage;
    let old_keys = [];
    for (let i = 0; i < store.length; i++) {
        if (store.key(i).startsWith("exchange.")) {
            console.log(store.key(i), "=", store.getItem(store.key(i)))
            let exchange = JSON.parse(store.getItem(store.key(i)));
            let age = Math.trunc(new Date().getTime() / 1000) - exchange.timestamp
            if (age > maxage) {
                console.log("Old key ", store.key(i), "age", age, "removing");
                //store.removeItem(store.key(i));
                old_keys.push(store.key(i));
                console.log("Pushed", store.key(i))
            }
        }
    }
    old_keys.forEach((value, index, array) => {
        console.log("old key", value);
        store.removeItem(value)
    });
}

async function storeExchangeKey(keyname, keydata) {
    let store = window.localStorage;
    let storageKey = "exchange." + await getSha1Base64Url(keyname);
    store.setItem(storageKey, JSON.stringify(keydata));
}

async function loadExchangeKey(keyname) {
    let store = window.localStorage;
    let storageKey = "exchange." + await getSha1Base64Url(keyname);
    return JSON.parse(store.getItem(storageKey));
}


function genMailtoURL(to, subject, body) {
    result = "mailto:" + encodeURIComponent(to);
    result += "?subject=" + encodeURIComponent(subject);
    result += "&body=" + encodeURIComponent(body)
    return result; //encodeURI(result);
}

function emailAddressValidate(email) {
    let exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return exp.test(email)
}

function showEither(elem1, elem2, first) {
    e1 = document.getElementById(elem1);
    e2 = document.getElementById(elem2);
    if (first) {
        e1.classList.remove("is-hidden");
        e2.classList.add("is-hidden");
    }
    else {
        e1.classList.add("is-hidden");
        e2.classList.remove("is-hidden");
    }
}

