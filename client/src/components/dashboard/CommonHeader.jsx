import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const CommonHeader = ({ title, subtitle, link, buttonText }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight"> {title}</h1>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <Button asChild>
        <Link href={link}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};

export default CommonHeader;
