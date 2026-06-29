# request-shell (rqsh)

An interactive, terminal-based HTTP client built for developers. Write HTTP requests using clean parameters, navigate response logs using Vim hotkeys, and inspect payloads in a REPL console.

## Installation

Install globally via npm:

```bash
npm install -g request-shell
```

## Usage

Boot into the interactive REPL shell:

```bash
rqsh
```

### Syntax Examples

* **GET Request:** `GET jsonplaceholder.typicode.com/posts limit==5`
* **POST Request:** `POST /posts title="Hello World" active:=true`
* **Headers:** `GET /users Authorization:Bearer`

## Documentation

For key bindings, advanced query parameters, and interactive guides, visit [rqsh.vercel.app](https://rqsh.vercel.app).
