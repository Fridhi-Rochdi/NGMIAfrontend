import { toJpeg, toPng } from 'html-to-image';

export type ArtworkFormat = 'html' | 'png' | 'jpg';

function safeFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase() || 'creation';
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function fetchCss(url: string): Promise<string> {
  const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
  if (!response.ok) throw new Error(`CSS ${response.status}`);
  return response.text();
}

async function inlineCssImports(css: string): Promise<string> {
  const importPattern = /@import\s+(?:url\(\s*)?(["'])(https?:\/\/.*?)\1\s*\)?[^;]*;/gi;
  const imports = Array.from(css.matchAll(importPattern));
  let result = css;
  for (const match of imports) {
    try {
      result = result.replace(match[0], await fetchCss(match[2]));
    } catch {
      result = result.replace(match[0], '');
    }
  }
  return result;
}

async function prepareArtworkHtml(html: string): Promise<string> {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  parsed.querySelectorAll('script, iframe, object, embed, meta[http-equiv="refresh" i]')
    .forEach((node) => node.remove());
  parsed.querySelectorAll<HTMLElement>('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
      if (/^javascript:/i.test(attribute.value.trim())) element.removeAttribute(attribute.name);
    });
  });

  const remoteStylesheets = Array.from(
    parsed.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"][href]'),
  );
  await Promise.all(remoteStylesheets.map(async (link) => {
    try {
      const style = parsed.createElement('style');
      style.setAttribute('data-export-inlined-from', link.href);
      style.textContent = await inlineCssImports(await fetchCss(link.href));
      link.replaceWith(style);
    } catch {
      link.remove();
    }
  }));

  await Promise.all(Array.from(parsed.querySelectorAll<HTMLStyleElement>('style')).map(async (style) => {
    style.textContent = await inlineCssImports(style.textContent || '');
  }));
  return `<!DOCTYPE html>\n${parsed.documentElement.outerHTML}`;
}

export async function downloadArtwork(
  html: string,
  name: string,
  format: ArtworkFormat,
): Promise<void> {
  const baseName = safeFileName(name);
  const preparedHtml = await prepareArtworkHtml(html);
  if (format === 'html') {
    const url = URL.createObjectURL(new Blob([preparedHtml], { type: 'text/html;charset=utf-8' }));
    triggerDownload(url, `${baseName}.html`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-same-origin');
  frame.setAttribute('aria-hidden', 'true');
  Object.assign(frame.style, {
    position: 'fixed',
    left: '-100000px',
    top: '0',
    width: '1440px',
    height: '1000px',
    border: '0',
    opacity: '0',
    pointerEvents: 'none',
  });
  try {
    await new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve();
      frame.onerror = () => reject(new Error('Impossible de préparer le rendu'));
      frame.srcdoc = preparedHtml;
      document.body.appendChild(frame);
    });

    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Document de rendu inaccessible');
    await frameDocument.fonts?.ready;
    await Promise.all(
      Array.from(frameDocument.images).map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.onload = () => resolve();
              image.onerror = () => resolve();
            }),
      ),
    );

    const menuPages = Array.from(
      frameDocument.querySelectorAll<HTMLElement>('[data-menu-page]'),
    );
    const poster = frameDocument.querySelector<HTMLElement>('.poster');
    const targets = menuPages.length
      ? menuPages
      : poster
        ? [poster]
        : [frameDocument.documentElement];

    for (let index = 0; index < targets.length; index += 1) {
      const node = targets[index];
      const width = Math.max(node.scrollWidth, node.offsetWidth, 320);
      const height = Math.max(node.scrollHeight, node.offsetHeight, 320);
      const computedBackground = frame.contentWindow?.getComputedStyle(node).backgroundColor;
      const options = {
        width,
        height,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: computedBackground && computedBackground !== 'rgba(0, 0, 0, 0)'
          ? computedBackground
          : '#ffffff',
      };
      let dataUrl: string;
      try {
        dataUrl = format === 'png'
          ? await toPng(node, options)
          : await toJpeg(node, { ...options, quality: 0.94 });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!/cssRules|CSSStyleSheet|SecurityError/i.test(message)) throw error;
        const safeOptions = { ...options, skipFonts: true };
        dataUrl = format === 'png'
          ? await toPng(node, safeOptions)
          : await toJpeg(node, { ...safeOptions, quality: 0.94 });
      }
      const pageSuffix = targets.length > 1 ? `-page-${index + 1}` : '';
      triggerDownload(dataUrl, `${baseName}${pageSuffix}.${format}`);
    }
  } finally {
    frame.remove();
  }
}
