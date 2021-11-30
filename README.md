Common Turris Bootstrap theme
=============================

This is common Turris Bootstrap theme for web applications based on Bootstrap
and Boostwatch theme Flatly and Darkly.


Integration to website
----------------------

You have to include dark and light styles separatelly with a special rule. On
router the themes should be in path `/turris-theme/`.

```
<link rel="stylesheet" id="css-dark" href="/turris-theme/darkly-5.min.css" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" id="css-light" href="/turris-theme/flatly-5.min.css" media="(prefers-color-scheme: light)">
<script src="/turris-theme/darkmode.js"></script>
```

Take care on the CSS files inclusion order. The default (the light theme) should
be included last to override previous theme if color schemes are not supported.

The Java Script is required to allow theme switch in runtime.

There is also a support for monochromatic icons and Turris icon is even included
in this theme. To include it you have to use toggether with `darkmode.js`:

```
<link rel="icon" id="light-scheme-icon" href="favicon-black.png">
<link rel="icon" id="dark-scheme-icon" href="favicon-white.png">
```

To also have toggle you have to include it with special ID `light-dark-btn` on
website and at the end of body you have to include:

```
<script async src="/turris-theme/darkmode_switch.js"></script>
```
