/**
 * Adds page-specific classes to <body> while the HTML is parsed, before first
 * paint. The original CSS keys a lot of layout off body classes (e.g. "noscroll").
 */
export function BodyClass({ names }: { names: string }) {
  const classes = JSON.stringify(names.split(/\s+/).filter(Boolean));
  return <script dangerouslySetInnerHTML={{ __html: `document.body.classList.add(...${classes});` }} />;
}
