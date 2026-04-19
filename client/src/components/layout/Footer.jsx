import { footerContents } from "@/constants";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const { title, description, menu, copyRight, link } = footerContents;
  return (
    <section className="border-t">
      <footer className="px-8 py-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            <Link
              href="/"
              className="text-xl font-bold flex items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              {title}
            </Link>
            <p className="mt-4 font-semibold text-muted-foreground">
              {description}
            </p>
          </div>
          {menu.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 font-semibold">{section.title}</h3>
              <ul className="space-y-4 text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="font-medium hover:text-primary">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
      <div className=" px-8 py-6 md:px-12 lg:px-16 mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
        <p>
          <Link
            href={link}
            className="underline hover:text-primary"
            target="blank"
          >
            ASHU
          </Link>{" "}
          {copyRight}
        </p>
      </div>
    </section>
  );
};

export default Footer;
