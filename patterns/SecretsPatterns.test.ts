import * as SecretsPatterns from './SecretsPatterns';
import { secretsPatterns } from './SecretsPatterns';

describe('secretsPatterns Tests', () => {
    const secretTokens = [
        'api_key="abcd1234"', // API key pattern
        'my_secret="123456789"', // Generic secret pattern
        'slack_bot_token="xoxb-1234-5678"', // Specific token pattern
        'password="mypassword"', // Common credentials
        'aws_access_key_id="AKIAIOSFODNN7EXAMPLE"', // AWS access key
        'aws_secret_access_key="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"', // AWS secret key
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', // Bearer token
        'ssh_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC7GiRscjIWrcfQXk6BpPHMeVHgzgCuzZL1yW0K5Gd5P4JH3Ft3QcMJ9O0VUz3I0KDdfR+7fJDAx2mG4iWYQnT3zK0koGh0P2StWt5RPg2GqG+4W9PjL0Yq+Mj80roVzCq9JZvHswx7Xv9qZ8DVqGKWsWYcV5ppxTgFjD7KPiXBwt4Y8W2I0I3L7sut8U8Fz4DyGiSjL5ac1+S8KUav7oJ+D3E5G5z5S+3x+mKkz7PjBd97x5QJl3MynMK+G/N68ub2tWZx4q1whDAgmbR5rpHxJDEeM5Iu5PiLJnvDaoudDk3GdyKaBFL+Ys5ABEiMj+mH5+JHMB6LJM8M4D5xJgh5 user@hostname"',
        'id_dsa="-----BEGIN DSA PRIVATE KEY-----\nMIIBuwIBAAKBgQDg+7Qe2gKUDUkYPzduIOrTf5uI3X8F1iX6ZOx++D5MlCFW+6mk\n7Jx7IXtOh+1Oq7IV8THlFb7iFg1iOFi9u4TDB2XfL4VWOGIEN/+mS6aFv1j++lK6\nTj8Kbi/pDv7lM1H99c9JMFuo1PHy6FZM3/ny6VxFk8wJ4GNl7ZEr+Z6G3QIVAJpx\nPGH02y1UgMOo2ihyA21m62olAoGAQ4qN0D4zgFPG8Q3uwFXaPKOqR6z5y33F7ETo\nKghybdnpJp9PPvHNxFNkITJjUmRrj79A8wV9tV4ATVdgbqBpULHf3+fle2nczXVc\n2rqQAx2vgBYpiy8LZZkffKpW7XLgO+6HnpBeDwIl2gH5tb5z6PM1AyZjghrR48DH\nCWRyRnECgYEA7mQhr7LmUp3FJ7gW3eLpDWd8E4bhBM4TCcEicu2SCVV4R45+keAM\notRV6j8h2Qo0I25hJd+mPdAwr3kmy1zmnkgGMuGanfRbMgMOQKUQm25XNj6QfuWo\n8rF8eS1TrmJipULjv7tm5C2OcGwOBa6ifMks5NNUYT0uqmG9nHTegh0CFDJc99gI\nkb84X9INc2wgoJDFZq6P/h8dLAb+Efvc5l7O2HjEnaGGkXh56+2gBREBzvImf8yj\n6Oq4XeqDjQ=\n-----END DSA PRIVATE KEY-----"', // DSA private key
        'SLACK_BOT_TOKEN="xoxb-2147483647-2147483647-abcdefgh"', // Slack bot token
        'irc_pass="password123"', // IRC password
        'encrypt_key="abc123"', // Encryption key
        'decrypt_key="def456"', // Decryption key
        'github_token="ghp_abcdEFGH12345678"', // GitHub token
        'consumer_key="CK123456789"', // Consumer key
        'client_secret="CS123456789"', // Client secret
        'session_secret="SS123456789"', // Session secret
        'public_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDPhzU4N5UV6ksZebVdGtYKojz4sDp2Dp2FgI1LJJmF5m3YjzJmB4dLsDjm+DvpweGABcdFJKWOPN9W5j0v3fWhsCk35Fiud3Gxk6UxVfz7uTWe3W2jN+AB4xFHuzj3vKeQb5G3TKU4lRfOhAsVhQz6lRA+LrZPgn/MIm8kzbIhQ9zE0ofGi9IsaMR5KgBr/MX7stj1x+ZjkzReiBudPK/3FbPSJ4j0rJ3H4IXNzK+zS/+CuYmWejU9GdVTQGJUVvMpUe8MJb2hbzeLU68TQmSZbJmWKWh4LNGs1/zZ0W9CjYsdE+dfKPAx1Cvlyz1XsB66szBFs1mb user@host"', // Public key
    ];

    secretTokens.forEach(token => {
        it(`matches secret pattern in: ${token}`, () => {
            expect(secretsPatterns.test(token)).toBeTruthy();
            secretsPatterns.lastIndex = 0; // Resetting due to global flag
        });
    });

    it('should match patterns for HTTP Basic Auth', () => {
        const basicAuthStrings = [
            'Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l', // Basic Auth pattern
            'Authorization:Basic dXNlcjpwYXNz', // Another Basic Auth pattern
        ];

        basicAuthStrings.forEach(authString => {
            expect(SecretsPatterns.secretsPatterns.test(authString)).toBeTruthy();
            SecretsPatterns.secretsPatterns.lastIndex = 0; // Resetting due to global flag
        });
    });

    it('should match patterns for base64 encoded source maps', () => {
        const sourceMapStrings = [
            'sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0LmpzIiwic291cmNlc0NvbnRlbnQiOltdfQ==', // Base64 SourceMap pattern
            'sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9', // Another Base64 SourceMap pattern
        ];

        sourceMapStrings.forEach(sourceMapString => {
            expect(SecretsPatterns.secretsPatterns.test(sourceMapString)).toBeTruthy();
            SecretsPatterns.secretsPatterns.lastIndex = 0; // Resetting due to global flag
        });
    });

    it('should not match unrelated patterns', () => {
        const unrelatedStrings = [
            'Hello, world!', // Plain text
            'user@example.com', // Email address
            'http://example.com/page', // URL
        ];

        unrelatedStrings.forEach(unrelatedString => {
            expect(SecretsPatterns.secretsPatterns.test(unrelatedString)).toBeFalsy();
            SecretsPatterns.secretsPatterns.lastIndex = 0; // Resetting due to global flag
        });
    });
});
