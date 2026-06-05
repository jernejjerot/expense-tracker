# Security Policy

## Supported Versions

This repository tracks security fixes on the `main` branch.

## Reporting a Vulnerability

Please do not open public issues for sensitive vulnerabilities.

1. Open a private security advisory on GitHub.
2. Include reproduction steps and potential impact.
3. Expect acknowledgement within 2 business days.

## Security Controls in This Repository

- `npm audit --audit-level=high` in CI.
- Secret scanning with `gitleaks`.
- Dependency review on pull requests.
- Helmet enabled on API responses.
- Strict runtime validation with Zod.
