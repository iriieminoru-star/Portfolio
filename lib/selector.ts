export function getSelector(el: HTMLElement): string {
  if (el.getAttribute("data-testid")) {
    return `[data-testid="${el.getAttribute("data-testid")}"]`;
  }

  if (el.id) {
    return `#${el.id}`;
  }

  if (el.getAttribute("name")) {
    return `[name="${el.getAttribute("name")}"]`;
  }

  if (el.getAttribute("aria-label")) {
    return `[aria-label="${el.getAttribute("aria-label")}"]`;
  }

  return el.tagName.toLowerCase();
}