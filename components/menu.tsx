import Link from "next/link";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
const Menu = ({ ...props }) => {
  const navItems = [
    { path: "/", icon: "speaker", title: "announcements", id: 1 },
    { path: "/", icon: "mail", title: "send", id: 2 },
    { path: "/", icon: "smile", title: "lucky", id: 3 },
    { path: "/", icon: "web", title: "my messages", id: 4 },
  ];

  return (
    <nav className="bg-greydark flex items-center justify-between p-4 rounded-lg">
      {navItems.map((item: any, i: number) => (
        <Link
          key={i}
          href={item.path}
          onClick={() => props.setModalSelection(item.id)}
        >
          <div className="bg-greylight/10 w-20 h-20 p-2 flex flex-col justify-center items-center rounded-lg cursor-pointer relative">
            <img src={`/${item.icon}.png`} alt="" className="w-full h-full" />
            <p className="absolute -bottom-4 text-white text-xs pb-2">
              {item.title}
            </p>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default Menu;
