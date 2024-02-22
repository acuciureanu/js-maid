// Inspired from https://raw.githubusercontent.com/PortSwigger/js-miner/main/src/main/java/burp/utils/Constants.java
const whiteSpaces = "(\\s*)";
const regexQuotes = "['\"`]";

const secretsRegexes = new RegExp(
    "['\"`]?(\\w*)" + // Starts with a quote then a word / white spaces
    whiteSpaces +
    "(secret|token|password|passwd|authorization|bearer|aws_access_key_id|aws_secret_access_key|irc_pass|SLACK_BOT_TOKEN|id_dsa|" +
    "secret[_-]?(key|token|secret)|" +
    "api[_-]?(key|token|secret)|" +
    "access[_-]?(key|token|secret)|" +
    "auth[_-]?(key|token|secret)|" +
    "session[_-]?(key|token|secret)|" +
    "consumer[_-]?(key|token|secret)|" +
    "public[_-]?(key|token|secret)|" +
    "client[_-]?(id|token|key)|" +
    "ssh[_-]?key|" +
    "encrypt[_-]?(secret|key)|" +
    "decrypt[_-]?(secret|key)|" +
    "github[_-]?(key|token|secret)|" +
    "slack[_-]?token)" +
    "(\\w*)" + // in case there are any characters / white spaces
    whiteSpaces +
    "['\"`]?" + // closing quote for variable name
    whiteSpaces + // white spaces
    "[:=]+[:=>]?" + // assignments operation
    whiteSpaces +
    regexQuotes + // opening quote for secret
    whiteSpaces +
    "([\\w\\-/~!@#$%^&*+\\s]+)" + // Assuming secrets will be alphanumeric with some special characters
    whiteSpaces +
    regexQuotes,
    "i"
);

const authorizationBearerTokenRegex = new RegExp("(?:Authorization:\\s+)?Bearer\\s+[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+\/=]*");

const privateKeyRegEx = new RegExp("BEGIN\\s+(RSA|DSA|EC|OPENSSH)\\s+PRIVATE\\s+KEY", "i");

const httpBasicAuthSecrets = new RegExp("Authorization.{0,5}Basic(\\s*)([A-Za-z0-9+/=]+)",
    "m");

const b64SourceMapRegex = new RegExp("sourceMappingURL=data(.*)json(.*)base64,((?:[a-z0-9+/]{4})*(?:[a-z0-9+/]{2}==|[a-z0-9+/]{3}=)?)(\\\\n)?",
    "i");

const secretsPatterns = new RegExp(
    authorizationBearerTokenRegex.source + "|" +
    privateKeyRegEx.source + "|" +
    secretsRegexes.source + "|" +
    httpBasicAuthSecrets.source + "|" +
    b64SourceMapRegex.source,
    "gi"
);

export { secretsPatterns };
