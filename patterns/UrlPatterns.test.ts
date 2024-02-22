import { schemeRegex, domainRegex, pathRegex, fileWithExtensionRegex, restApiRegex, urlPattern } from "./UrlPatterns";

describe('URL Regex Tests', () => {
    // Scheme Regex Tests
    test('matches http scheme', () => {
        expect('http://example.com').toMatch(schemeRegex);
    });

    test('matches https scheme', () => {
        expect('https://example.com').toMatch(schemeRegex);
    });

    test('does not match non-http/https schemes', () => {
        expect('ftp://example.com').not.toMatch(schemeRegex);
    });

    // Domain Regex Tests
    test('matches simple domain', () => {
        expect('http://example.com').toMatch(domainRegex);
    });

    test('matches subdomain', () => {
        expect('http://www.example.com').toMatch(domainRegex);
    });

    test('matches domain with port', () => {
        expect('http://example.com:8080').toMatch(domainRegex);
    });

    // Path Regex Tests
    test('matches root path', () => {
        expect('http://example.com/').toMatch(pathRegex);
    });

    test('matches multi-level path', () => {
        expect('http://example.com/about/team').toMatch(pathRegex);
    });

    // File With Extension Regex Tests
    test('matches URL with file extension', () => {
        expect('http://example.com/index.html').toMatch(fileWithExtensionRegex);
    });

    test('matches file with query string', () => {
        expect('http://example.com/script.js?version=1.2').toMatch(fileWithExtensionRegex);
    });

    // REST API Regex Tests
    test('matches basic API endpoint', () => {
        expect('http://example.com/api/users').toMatch(restApiRegex);
    });

    test('matches nested API endpoint', () => {
        expect('http://example.com/api/users/1234/posts').toMatch(restApiRegex);
    });

    // Combined Pattern Tests
    test('matches basic URL', () => {
        expect('http://example.com').toMatch(urlPattern);
    });

    test('matches complex URL', () => {
        expect('https://sub.example.com/about/team/index.html?ref=homepage#section').toMatch(urlPattern);
    });
});
