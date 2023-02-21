import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsMoonFill, BsSun } from "react-icons/bs";
import { TbWriting } from "react-icons/tb";
import ContactUs from "./ContactUs";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function Header() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  let [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="w-full">
      <div className="md:flex items-center justify-between py-4 md:px-10 px-7">
        <div className="font-bold -mt-1 flex direction-row text-2xl cursor-pointer items-center text-gold">
          <button>
            <Link href="/" className="flex items-center space-x-3">
              <TbWriting
                className={"h-10 w-10  text-gray-700 dark:text-white"}
              />
              <h1 className="sm:text-4xl text-2xl  font-bold ml-2 tracking-tight text-black dark:text-white">
                SiteExplainer
              </h1>
            </Link>
          </button>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute z-20 right-6 top-12 cursor-pointer md:hidden  text-white">
          <button>
            {open ? (
              <AiOutlineClose className="text-white" />
            ) : (
              <AiOutlineMenu className="text-black dark:text-white" />
            )}
          </button>
        </div>

        <ul
          className={`md:flex md:items-center items-end md:pb-0 pb-12 absolute md:static md:z-auto text-white md:bg-transparent bg-gold hover:text-gold z-10 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in font-rubik bg-gray-500 dark:bg-gray-500 md:dark:bg-transparent ${
            open ? "top-0" : "top-[-490px]"
          }`}>
          <div className="mt-10">
            <button className="md:hidden flex">
              <Link href="/" className="flex items-center space-x-3">
                <TbWriting className={"h-10 w-10 mt-2 text-white "} />
                <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight text-white">
                  SiteExplainer
                </h1>
              </Link>
            </button>
          </div>
          <div className="flex md:flex-row gap-4 justify-around mt-8 md:mt-0 ">
            <button
              className="flex text-4xl items-center text-center dark:text-black md:dark:text-white md:text-black"
              disabled>
              <FaLanguage className="dark:text-white md:text-gray-400" />
            </button>
            <ContactUs />
            <div
              onClick={() => setOpen(false)}
              className="flex justify-center border-2 rounded-full  dark:border-white md:border-gray-700 md:dark:border-white">
              {currentTheme === "dark" ? (
                <button
                  className="p-2 text-xl dark:text-white text-black cursor-pointer md:dark:text-white"
                  onClick={() => setTheme("light")}>
                  <BsMoonFill className={"dark:text-white text-black"} />
                </button>
              ) : (
                <button
                  className="p-2 dark:text-red text-xl cursor-pointer md:text-gray-700 dark:text-white"
                  onClick={() => setTheme("dark")}>
                  <BsSun className={" dark:text-white "} />
                </button>
              )}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
