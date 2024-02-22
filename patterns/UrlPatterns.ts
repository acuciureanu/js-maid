export const schemeRegex = /https?:\/\//; // Matches schemes like http://, https://

// Assuming domainRegex matches domains with optional subdomains or sub-subdomains, including port numbers
export const domainRegex = /(?:[\w-]+\.)+[\w.-]+(?::\d+)?/;

// Optional: Matches paths, refined to reduce false positives
export const pathRegex = /(?:\/[\w.-]+)*\/?/;

// Optional: Matches files with extension, including optional query or fragment
export const fileWithExtensionRegex = /(?:\/[\w.-]+)*\/[\w.-]+(?:\.(?:php|asp|aspx|jsp|json|action|html|js|txt|xml))(?:[\?|#]\S*)?/;

// Optional: Matches REST API endpoints
export const restApiRegex = /\/api\/[\w.-]+(?:\/[\w.-]+)*(?:[\?|#]\S*)?/;

// Combine the patterns, ensuring the scheme and domain are matched first
const urlPattern = new RegExp(
  `(${schemeRegex.source}${domainRegex.source}` +
  `${pathRegex.source}?)|` + // Include path in the main pattern
  `(${fileWithExtensionRegex.source})|` +
  `(${restApiRegex.source})`,
  "gi"
);

export { urlPattern };
