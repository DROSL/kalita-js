# kalita-js

**Kalita** is text-to-speech software with a special focus on data minimization and user privacy. We do not collect any personal data, do not set tracking cookies and do not outsource our service to third-party cloud solutions. The speech synthesis takes place on-premises on your own server and still offers many of the conveniences of a conventional readspeaker.

- [**kalita-server**](https://github.com/azmke/kalita-server) is a server written in Python that provides the speech synthesis.
- [**kalita-js**](https://github.com/azmke/kalita-js) is a JavaScript client for integration into a website that provides a graphical user interface.

## Quick start

To add Kalita to your website, [download the latest release](https://github.com/azmke/kalita-js/releases) and place the files on your web server. Then embed them as follows:

### CSS

Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets to load our CSS:
```html
<link rel="stylesheet" type="text/css" href="kalita.css">
```

### HTML

Add the following `<div>` element to a position on your page where the graphical interface should be displayed:
```html
<div id="kalita-player"></div>
```

### JS

Our components require the use of JavaScript to function. Place the following `<script>` near the end of your pages, right before the closing `</body>` tag, to enable them:
```html
<script src="kalita.js"></script>
```

## Build

You can also view the source code, edit it and then build your own version. For this you will need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

1. Clone the repository.
```bash
git clone https://github.com/azmke/kalita-js
```

2. Install the required modules.
```bash
npm run install
```

3. Build the source code.

```bash
npm run build
```
