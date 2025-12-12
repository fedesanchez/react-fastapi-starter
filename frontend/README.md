# React + shadcn-ui

What's included in the template?

- shadcn-ui + tailwindcss
- basic auth with JWT:
  - In memory(state not localStorage) + Short live *Access Token*
  - HttpOnly Cookie + Long live *Refresh Token*
  - Request new *Access Token* when expired(middleware) or page reload

