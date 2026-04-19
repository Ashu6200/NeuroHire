import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import Image from "next/image";

const AiInterviewCard = ({ post }) => {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-2 m-0 shadow-sm transition-shadow hover:shadow-md">
      {/* <div className="relative h-30 overflow-hidden sm:h-38 md:h-46">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary hover:bg-primary/90">
            {post.category}
          </Badge>
        </div>
      </div> */}
      <CardContent className="flex-grow">
        <div className="text-muted-foreground mb-2 flex items-center text-xs sm:mb-3 sm:text-sm">
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span>{post.date}</span>
        </div>
        <h3 className="mb-2 line-clamp-2 text-base font-semibold sm:text-lg">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-xs sm:line-clamp-3 sm:text-sm">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="">
        <Button variant="ghost" size="sm" className="w-full text-sm" asChild>
          <Link
            href={`/ai-interview/${post.id}`}
            className="flex items-center justify-center"
          >
            Read Article
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiInterviewCard;
