import { Button, buttonVariants } from "../ui/button";
const buttons = [
  { text: "FAQ", href: "#" },
  { text: "Help center", href: "#" },
  { text: "Privacy", href: "#" },
  { text: "Social", href: "#" },
  { text: "My account", href: "#" },
  { text: "Contact us", href: "#" },
];
function Footer() {

  return <>
    <div className="bottom-0 w-[100%] bg-white/95 dark:bg-slate-500/85 p-2">
      <div className="mr-2 ml-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 p-1 py-0.5 justify-items-start">
        {buttons.map((button, index) => (
          <Button
            key={index}
            className={`${buttonVariants({ variant: "link" })}
            text-lg font-normal bg-transparent hover:bg-transparent hover:text-gray-400 `}
          >
            <a href={button.href}>{button.text}</a>
          </Button>
        ))}
      </div>
      <div>
        <p className="text-sm text-center mt-8 dark:text-gray-300">
          © 2024 - 2024 TaskPilot By Beni Visotski-Or Peretz-Elior Stolerman-Elen Lesovoy- All Rights Reserved.
        </p>
      </div>
    </div>
  </>;
}

export default Footer;
