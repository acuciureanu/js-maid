# js-maid 🕵️ - Your JavaScript Investigator

js-maid started off as an idea to break down JavaScript into an AST (kinda like a blueprint) and then run some smart checks on it. It's a handy little tool for folks diving into code, looking for bugs, or just trying to get a grip on what's happening under the hood.

## Install Bun.sh

Check this out: [Bun.sh installation instructions](https://bun.sh/docs/installation)

## Features 🌟

- **In-depth Analysis**: Thorough investigation of JavaScript code to identify patterns and potential vulnerabilities.
- **Custom Rules**: Utilize predefined rules to enhance your code investigation.
- **Regex Guide**: Leverage detailed regex patterns to pinpoint specific code structures.

## Installation 🛠

Get started with js-maid by installing the necessary dependencies:

```bash
bun install
```

## Running js-maid 🏃

To start investigating your JavaScript code, run:

```bash
bun run App.ts
```

## Compilation 📦

Compile your findings with js-maid:

```bash
bun build App.ts --compile --outfile=js-maid
```

## Running Tests 🧪

Ensure your code's integrity by running tests:

```bash
bun test
```

## Developer Guide 📚

### Implemented Rules

- **LiteralRule**: Checks text inside quotes against patterns to find important info like secrets.

- **ReferenceResolverRule**: Tracks variable names to their values for deeper code analysis.

- **TemplateLiteralRule**: Builds and analyzes dynamic strings with variables for pattern matching.

- More rules to come. The tool is not perfect and there are corner cases that I didn't know about.

## MatchingRule Instances

In our application, we use the `MatchingRule` feature to create specific instances for different matching needs. Here are a couple of examples:

```typescript
const urlMatchingRule = new MatchingRule("endpoints", urlPattern);
const secretsMatchingRule = new MatchingRule("secrets", secretsPatterns);
```



In the above code:

- `urlMatchingRule` is a `MatchingRule` instance that matches URLs. It uses the pattern defined in `urlPattern`. The label "endpoints" is used to identify matches found with this rule.

- `secretsMatchingRule` is a `MatchingRule` instance that matches secrets. It uses the pattern defined in `secretsPatterns`. The label "secrets" is used to identify matches found with this rule.

These instances can then be used throughout the application to check if certain strings match their respective patterns. The labels ("endpoints" or "secrets") can be used to identify which rule a match was found with.

## Contributing 🤝

We welcome contributions to js-maid! Whether it's enhancing the rules, expanding the regex patterns, or improving documentation, your input is invaluable.

## License 📜

js-maid is open-source software licensed under the MIT license.

## Support 💖

Love js-maid? Star this on GitHub and spread the word! Your support motivates me to continuously improve.

Dive into your JavaScript investigations with js-maid and uncover the insights you need. Happy coding!
