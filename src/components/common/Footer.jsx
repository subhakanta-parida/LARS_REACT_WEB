const linkClass = 'text-lars-green underline-offset-[5px] hover:decoration-2';

export default function Footer() {
  return (
    <footer className="mt-auto flex flex-wrap justify-center gap-x-[22px] gap-y-3 text-[12px] text-lars-muted">
      <span>&copy; {new Date().getFullYear()} Manulife</span>
      <a className={linkClass} href="https://www.manulife.ca/privacy-policy.html" target="_blank" rel="noreferrer">Privacy<span className="sr-only"> (opens in a new tab)</span></a>
      <a className={linkClass} href="https://www.manulife.ca/accessibility.html" target="_blank" rel="noreferrer">Accessibility<span className="sr-only"> (opens in a new tab)</span></a>
    </footer>
  );
}
