export default function Header() {
  return (
    <header className="flex min-h-[52px] items-stretch bg-lars-rail pr-7 text-[15px] text-white max-[760px]:min-h-12 max-[760px]:pr-5">
      <span className="flex items-center border-t-4 border-lars-brand px-7 font-bold max-[760px]:px-5">LARS</span>
      <span className="ml-[22px] self-center text-[#ececf0] max-[760px]:hidden">Manulife employee access</span>
      <a className="ml-auto flex items-center border-l border-[#656778] pl-6 text-white no-underline" href="https://www.manulife.ca/personal/support/contact-us.html" target="_blank" rel="noreferrer">Contact us<span className="sr-only"> (opens in a new tab)</span></a>
    </header>
  );
}
