import Link from "next/link";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
import { TbWriting } from "react-icons/tb";

export default function Footer() {
  return (
    // <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex flex-col justify-between items-center px-3 sm:mb-0 mb-3">
    //   <div className="flex flex-row justify-center w-full">
    //     <div className="flex flex-row">
    //       <p className="font-bold hover:underline transition underline-offset-2 ml-1"></p>
    //       <p className="font-bold transition">
    //         Follow @michael_chomsky on{" "}
    //         <Link
    //           href="https://twitter.com/michael_chomsky"
    //           className="text-blue-600 hover:underline">
    //           Twitter
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    //   <div className="font-semibold">
    //     Donate to support the Project
    //     <Link
    //       href="https://www.paypal.com/donate/?business=9CKXQHCEVY3V6&no_recurring=0&item_name=This+donation+will+help+me+keep+siteexplainer.com+up+and+running%21+API+fees+cost+me+around+1k+per+week%21&currency_code=USD"
    //       className="text-blue-600 font-bold hover:underline">
    //       {" "}
    //       Paypal
    //     </Link>
    //   </div>
    //   <p className="font-semibold">@Copyright all rights reserved</p>
    // </footer>
    // footer
    <div className="w-full mx-auto bg-gray-300 dark:bg-gray-200 flex justify-center">
      <footer className="md:p-4 sm:p-0">
        <div className="md:flex md:justify-between">
          <div className="flex flex-row md:items-start mb-6 md:mb-0 md:mr-[15rem] justify-center mx-auto items-center">
            <TbWriting className={"h-6 w-6 text-gray-700 mt-1"} />
            <a href="#" target="_blank" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap text-black">
                SiteExplainer
              </span>
            </a>
          </div>
          <div className=" gap-8 sm:gap-6">
            <div className="flex md:flex-row flex-col text-gray-700 justify-center w-full">
              {" "}
              <div className="flex md:flex-row flex-col ">
                {" "}
                <p className="font-bold hover:underline transition underline-offset-2 ml-1"></p>{" "}
                <p className="font-bold transition text-gray-700">
                  Follow @michael_chomsky on{" "}
                  <Link
                    href="https://twitter.com/michael_chomsky"
                    className="text-blue-600 hover:underline">
                    Twitter
                  </Link>
                </p>
              </div>
            </div>
            <div className="font-semibold text-gray-700">
              Donate to support the Project
              <Link
                href="https://www.paypal.com/donate/?business=9CKXQHCEVY3V6&no_recurring=0&item_name=This+donation+will+help+me+keep+siteexplainer.com+up+and+running%21+API+fees+cost+me+around+1k+per+week%21&currency_code=USD"
                className="text-blue-600 font-bold hover:underline">
                {" "}
                Paypal
              </Link>
            </div>
            <div>
              {/* <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow us
              </h3> */}
            </div>
          </div>
        </div>
        {/* <div className="my-3 border-gray-200 md:border-t sm:border-0 sm:mx-auto dark:border-gray-700 lg:my-4"></div>
        <div className="flex md:flex-row flex-col items-center justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            ©2023{" "}
            <a
              href="https://flowbite.com"
              target="_blank"
              className="hover:underline">
              michael_chomsky
            </a>
            . All Rights Reserved.
          </span> */}
        {/* <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsFacebook />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsInstagram />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsTwitter />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsGithub />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsDribbble />
            </a>
          </div> */}
        {/* </div> */}
      </footer>
    </div>
  );
}
