# Security Policy

## Supported Versions

This project is under active development. Security fixes are typically applied to the latest version on the default branch.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

Use one of the following private channels instead:

- GitHub Private Vulnerability Reporting, if it is enabled for this repository
- Direct contact with the project maintainer, if you already have a private channel available

If you are unsure how to report privately, open a public issue with no sensitive details and request a secure contact method.

## What to Include

Please include as much of the following as possible:

- A short description of the issue
- Steps to reproduce
- Impact and possible attack scenario
- Affected routes, components, or files
- Any proof of concept, logs, or screenshots that help explain the issue
- Suggested remediation, if you have one

## Response Expectations

Best effort will be made to:

- Acknowledge valid reports within 7 days
- Confirm severity and impact after review
- Prepare and ship a fix as quickly as practical
- Credit the reporter if they would like to be acknowledged

## Scope

This policy covers vulnerabilities in the application code, configuration, and dependencies used by this repository.

Out of scope:

- Issues that require physical access to a device
- Social engineering attacks
- Denial-of-service reports without a clear application-level vulnerability
- Reports for already disclosed vulnerabilities without a new exploit path

## Secrets and Local Setup

If you suspect that an environment variable, database credential, or API secret has been exposed:

1. Rotate the secret immediately
2. Revoke old credentials
3. Audit recent access logs
4. Report the exposure through a private channel
