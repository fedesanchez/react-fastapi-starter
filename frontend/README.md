# React JWT auth starter template

## Layered architecture template

This is the classic structure. Files are grouped by their technical role.
_cons:_ If the project grows too large, the components, types, or services folder becomes unmanageable.

What's included in the template?

- basic auth with JWT:
  - Typescript types
  - React-form-hooks + Schema validation with Zod (request/response validation)
  - In memory (zustand store) + Short live _Access Token_
  - HttpOnly Cookie + Long live _Refresh Token_
  - Request new _Access Token_ when expired (middleware) or page reload
- UI: shadcn-ui + tailwindcss

This layout is inspired by [this](https://github.com/dreamsofcode-io/authly/)

