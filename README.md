<a href="https://www.morganbkf.com/highlighter-pen/" target="_blank">
  <img src="https://github.com/mimoklef/highlighter-pen/blob/main/assets/demotitle.png?raw=true" />
</a>

<p>
A simple JavaScript library that replaces the native text selection with a marker-like highlight effect.
</p>

<p>
It behaves like a real highlighter: drag your mouse over text and see a custom overlay instead of the default selection.
</p>

<a href="https://www.morganbkf.com/highlighter-pen/" target="_blank">
  <img width="40%" src="https://github.com/mimoklef/highlighter-pen/blob/main/assets/subtitle.jpg?raw=true" />
</a>


<h2>✨ Features</h2>

<ul>
  <li>Marker-style highlight effect</li>
  <li>Works across multiple lines</li>
  <li>Keeps native selection inside inputs and textareas</li>
  <li>No dependencies</li>
  <li>Plug &amp; play (1 script)</li>
</ul>


<h2>🚀 Demo</h2>

<p>
<a href="https://www.morganbkf.com/highlighter-pen/" target="_blank">
You can access this demo and try it yourself
</a>
</p>


<h2>📦 Installation</h2>

<h3>CDN (recommended)</h3>

<pre><code>&lt;script src="https://cdn.jsdelivr.net/gh/mimoklef/highlighter-pen@v1.0.4/dist/highlighter-pen.js"&gt;&lt;/script&gt;
&lt;script&gt;
  HighlighterPen().init();
&lt;/script&gt;
</code></pre>

<h3>NPM</h3>

<pre><code>npm install highlighter-pen
</code></pre>

<p>And import it with</p>

<pre><code>const HighlighterPen = require("highlighter-pen");

HighlighterPen().init();
</code></pre>


<h2>🎨 Customization</h2>

<p>
The highlight is rendered using a <code>&lt;marker&gt;</code> element, which can be fully customized with CSS.
</p>
<p>
You can override its appearance with your own CSS (e.g. in a <code>&lt;style&gt;</code> tag or a stylesheet) to match your design.
</p>


<h3>Blend modes</h3>

<p>Depending on your background, different blend modes may look better:</p>

<pre><code>/* Default (light backgrounds) */
marker { mix-blend-mode: multiply; }

/* Dark backgrounds */
marker { mix-blend-mode: lighten; }

/* Disable blending */
marker { mix-blend-mode: normal; }
</code></pre>

<h3>Z-index</h3>

<p>
You can control whether the marker appears above or below your content:
</p>

<pre><code>marker {
  z-index: 0 !important;
}
</code></pre>

<p>
You may need to adjust your page layout (e.g. <code>position</code> / <code>z-index</code>) to get the desired result.
</p>

<h3>Custom marker image</h3>

<p>You can replace the marker texture:</p>

<pre><code>marker {
  border-image-source: url("your-image.png");
}
</code></pre>

<h3>Other styles</h3>

<p>You can freely adjust opacity, filters, etc.:</p>

<pre><code>marker {
  opacity: 0.9;
  filter: brightness(1.2);
}
</code></pre>

<h3>Excluding elements</h3>

<p>If you want to prevent selection on some elements:</p>

<pre><code>.no-select {
  user-select: none;
}
</code></pre>

<p>
The library is designed to be flexible: you can adapt the rendering entirely via CSS depending on your needs.
</p>



<h2>🙋🏻‍♂️ Author</h2>

<p>
Made with ❤️ by 
<a href="https://www.morganbkf.com/" target="_blank">Morgan Bouyakhlef</a>
</p>
