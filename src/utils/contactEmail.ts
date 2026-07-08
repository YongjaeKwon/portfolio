export const MAIL_FALLBACK_DELAY_MS = 1200;

export function createMailtoUrl(email: string) {
  return `mailto:${email}`;
}

export function createGmailComposeUrl(email: string) {
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", email);
  return url.toString();
}

export function shouldShowMailFallback(openedExternally: boolean) {
  return !openedExternally;
}
