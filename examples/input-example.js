// Example of a literal with potential secret (should be caught by the SecretsPattern rule)
const secretApiKey = "12345-secret-api-key-67890";

// Example of a URL (should be caught by the UrlPattern rule)
const endpointUrl = "https://api.example.com/v1/users";

// Example of a prototype pollution vulnerability (should be caught by the PrototypePollutionRule)
let obj = {};
obj.__proto__.polluted = true;

// Example of safe object usage (should not trigger any rule)
let safeObj = Object.create(null);
safeObj.safeProperty = "This is a safe usage";

// Example of using template literals (should be analyzed by the TemplateLiteralRule)
const user = "John";
console.log(`Welcome, ${user}!`);

// Direct Object.prototype manipulation (should trigger the PrototypePollutionRule)
Object.prototype.modified = 'This modification affects all objects';

// Example of non-vulnerable code (should not trigger any rule)
function calculate(a, b) {
    return a + b;
}

// Dynamically constructed URL (potential to be caught by a sophisticated UrlPattern rule)
const userId = 123;
const dynamicUrl = `https://api.example.com/v1/users/${userId}`;

// Example of potential secret in code that might be obfuscated or missed
const encodedCredentials = btoa("user:pass");

// Example of another safe usage that should not trigger any rule
let anotherSafeObj = {};
anotherSafeObj['data'] = 'Just some harmless data here';

// Example of an API key as a potential secret
const apiKey = "AIzaSyD-b2f0XgZy3FQDx2040w28LcsjXs1eO8I";

// Example of a password in a configuration
const dbPassword = "p@ssw0rd123";

// Example of a token being assigned
let accessToken = "12345abcdef67890";

// Example of AWS credentials exposed in a script
const awsSecretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Example of a GitHub token exposed
const gitHubToken = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Example of a Slack Bot Token exposed
const slackBotToken = "xoxb-1234-567890-abcdefg12345";

// Example using bearer token authorization header
const authHeader = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Example of a private SSH key exposed in the code
const privateKey = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAwbm9uZQAAAAAAAAABAAAAaAAAABNlY2RzYS
1zaGEyLW5pc3RwMjU2AAAACG5pc3RwMjU2AAAAQQRwPZQ5L6xFS/xqA/1zBaxz+0XYB95h
cNq1zvIA+Ws2vrWAZ+cLlVNDFZmFlt9C6kTp5cwVGRs5Z0UAAAAsGxIGFsbEiBbAAAAE2V
jZHNhLXNoYTItbmlzdHAyNTYAAABBBHA9lDkvrEVL/GoD/XMFrHP7RdgH3mFw2rXO8gD5a
za+toBn5wuVU0MVmYWV30LqROnlzBUYGzlnRQAAAAgQD1U8XZR0eO2+KhBc3VvIhdSGXVC
NI9j8g8I3Vr5FUwAAAECAwQFBgc=-----END OPENSSH PRIVATE KEY-----`;

// Example of Basic Auth credentials in an Authorization header
const basicAuth = "Authorization: Basic dXNlcjpwYXNzd29yZA==";

// Example of a sensitive token embedded directly in a dynamic script tag
const sourceMap = "sourceMappingURL=data:application/json;base64,dGVzdCBjb250ZW50IHNvdXJjZSBtYXA=";
