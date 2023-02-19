import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useId } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import BackgroundCircles from "../components/BackgroundCircles";
import { randomSiteData } from "../lib/randomSiteData";
import { RiNumber1 } from "react-icons/ri";
import Link from "next/link";


const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [randomizing, setRandomizing] = useState(false);
  const [url, setUrl] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState<String>("");
  const [latestSites, setLatestSites] = useState<Array<any>>([]);
  // console.log("Streamed response: ", generatedSummary);
  useEffect(() => {
    console.log("loaded");
    fetchLatestSites();
  }, []);

  useEffect(() => {
    if (randomizing) {
      setLoading(false);
      return () => { };
    }
  }, [loading]);


  function fetchLatestSites() {
    setLatestSites([]);
    fetch("/api/latestSites")
      .then((res) => res.json())
      .then((data) => {
        let newLatestSites: String[] = [];
        data.map((url: any) => newLatestSites.push(url.url));
        setLatestSites(newLatestSites);

        console.log(data);
      });
  }

  function handleLatestSiteClick(url: string) {
    setUrl(url);
    generateSummary(url);
  }

  const postSummary = (url: string, summary: string) => {
    fetch("/api/postSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        summary: summary,
      }),
    }).then(() => fetchLatestSites());
  }

  const generateSummary = async (recentURL: string = url) => {
    setGeneratedSummary('');
    setLoading(true);

    const isValidURL = (str: string) => {
      try {
        new URL(str);
        return true;
      } catch (error) {
        return false;
      }
    };

    let fullUrl = recentURL.trim();
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = 'https://' + fullUrl;
    }

    console.log(fullUrl);

    if (!isValidURL(fullUrl)) {
      console.error('Invalid URL provided.');
      toast.error('Invalid URL provided', {
        icon: '❌',
      });
      setLoading(false);
      return;
    }

    const summary = await fetch('/api/getSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: fullUrl,
      })
    });

    const summaryData = await summary.json();
    console.table(summaryData);

    if (summaryData !== null) {
      setGeneratedSummary(summaryData.summary);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/fetchWebsiteContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: fullUrl,
        }),
      });

      console.log("fetched and trimmed", response)

      if (!response.ok) {
        const statusText = response.statusText
          ? response.statusText
          : "This site isn't valid. Maybe try another?";
        toast.error(statusText, {
          icon: '❌',
        });
        setLoading(false);
        return;
      }

      const siteContent = await response.text();

      const summaryResponse = await fetch('/api/generateSummaryFromText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: siteContent,
        }),
      });
      console.log("Edge function returned.");
      console.log("Response is", summaryResponse);

      if (!response.ok) {
        const statusText = summaryResponse.statusText
          ? summaryResponse.statusText
          : "This site isn't valid. Maybe try another?";
        toast.error(statusText, {
          icon: "❌",
        });
        setLoading(false);

        // throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = summaryResponse.body;
      console.log("Data readable stream", data);
      if (!data) {
        setLoading(false);
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGeneratedSummary((prev) => {
          const newGeneratedSummary = prev + chunkValue;
          console.log("summary is ", newGeneratedSummary);

          if (done && newGeneratedSummary.length >= 50) {
            postSummary(fullUrl, newGeneratedSummary);
          }
          return newGeneratedSummary;
        });
      }

      setLoading(false);
    } catch (error) {
      const statusText = "An unexpected error occured. Try again or try another site"
      toast.error(statusText, {
        icon: "❌",
      });
      setLoading(false);
    }
  }

  //   const generateSummary = async (recentURL: string = url) => {
  //     setGeneratedSummary("");
  //     setLoading(true);

  //     const isValidURL = (str: string) => {
  //       try {
  //         new URL(str);
  //         return true;
  //       } catch (error) {
  //         return false;
  //       }
  //     };

  //     let fullUrl = recentURL.trim();
  //     if (!/^https?:\/\//i.test(fullUrl)) {
  //       fullUrl = "https://" + fullUrl;
  //     }
  //     console.log(fullUrl);

  //     if (!isValidURL(fullUrl)) {
  //       console.error("Invalid URL provided.");
  //       // display a toast
  //       toast.error("Invalid URL provided", {
  //         icon: "❌",
  //       });
  //       setLoading(false);
  //       return;
  //     }

  //     console.log("url is", fullUrl);
  //     console.log("url is", fullUrl);
  //     const summary = await fetch('/api/getSummary', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         url: fullUrl,
  //       })
  //     });

  //     const summaryData = await summary.json();
  //     console.table(summaryData);

  //     if (summaryData !== null) {
  //       setGeneratedSummary(summaryData.summary);
  //       setLoading(false);
  //       return;
  //     }
  // //     const r = await fetch(`https://www.w3.org/services/html2txt?url=${encodeURIComponent(url)}&noinlinerefs=on&nonums=on`, { mode: 'no-cors' });
  // // console.log("r", r);
  // try {
  //   let siteText: string;
  //   const res = await fetch(
  //     `https://www.w3.org/services/html2txt?url=${encodeURIComponent(
  //       fullUrl
  //     )}&noinlinerefs=on&nonums=on`,
  //     { mode: 'no-cors' }
  //   );
  //   console.log("html response", res)
  //   if (res.status === 200) {
  //     siteText = await res.text();
  //     console.log(siteText)
  //     if (siteText.length > 200) {
  //       // The result is valid
  //       if (siteText.length > 400) {
  //         siteText = Buffer.from(siteText, 'utf-8').toString()
  //         siteText = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim() 
  //         console.log("trimmed", siteText)
  //         let encoded = encode(siteText)
  //         encoded = encoded.slice(0,4000)
  //         siteText = decode(encoded)
  //         console.log("decoded", siteText)
  //         siteText = siteText.substring(0, 100)

  //       }
  //     } else {
  //       const statusText = "This site doesn't have enough content to summarize"
  //       toast.error(statusText, {
  //         icon: "❌",
  //       });
  //       setLoading(false);
  //     }
  //   } else {
  //     const statusText = "Could not parse site content"
  //       toast.error(statusText, {
  //         icon: "❌",
  //       });
  //       setLoading(false);
  //   }


  //     const response = await fetch("/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         url: fullUrl,
  //       }),
  //     });
  //     console.log("Edge function returned.");
  //     console.log("Response is", response);

  //     if (!response.ok) {
  //       const statusText = response.statusText
  //         ? response.statusText
  //         : "This site isn't valid. Maybe try another?";
  //       toast.error(statusText, {
  //         icon: "❌",
  //       });
  //       setLoading(false);

  //       // throw new Error(response.statusText);
  //     }

  //     // This data is a ReadableStream
  //     const data = response.body;
  //     console.log("Data readable stream", data);
  //     if (!data) {
  //       setLoading(false);
  //       return;
  //     }

  //     const reader = data.getReader();
  //     const decoder = new TextDecoder();
  //     let done = false;

  //     while (!done) {
  //       const { value, done: doneReading } = await reader.read();
  //       done = doneReading;
  //       const chunkValue = decoder.decode(value);
  //       setGeneratedSummary((prev) => {
  //         const newGeneratedSummary = prev + chunkValue;
  //         console.log("summary is ", newGeneratedSummary);

  //         if (done && newGeneratedSummary.length >= 50) {
  //           postSummary(fullUrl, newGeneratedSummary);
  //         }
  //         return newGeneratedSummary;
  //       });
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     const statusText = "An unexpected error occured. Try again or try another site"
  //       toast.error(statusText, {
  //         icon: "❌",
  //       });
  //       setLoading(false);
  //   }

  function randomizeSite() {
    setRandomizing(true);
    let randomValue =
      randomSiteData[Math.floor(Math.random() * randomSiteData.length)];
    setUrl(randomValue);
    generateSummary(randomValue).then(() => setRandomizing(false));
  }

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Head>
          <title>SiteExplainer</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <div className={"z-0"}>
          <BackgroundCircles />
        </div>
        <main className="flex z-10 flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
          <h1 className="mx-auto mt-10 md:mt-24 z-2 max-w-4xl font-bold text-3xl tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Simplify Complex Websites with{" "}
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none">
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.generateS442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">SiteExplainer</span>
            </span>{" "}
            Say Goodbye to Confusing Pages.
          </h1>
          <Link
            href="https://github.com/MichaelAPCS/siteexplainer"
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-700 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100  mt-6"
            target="_blank"
            rel="noopener noreferrer">
            <Github />
            <p>Star on GitHub</p>
          </Link>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-gray-200">
            An effortless way to understand what a website is about, Our
            AI-powered web app allows you to quickly and accurately summarize
            any website in just a few seconds
          </p>
          {/* <p className="text-slate-700 mt-5 dark:text-gray-300">
              5196 site summaries generated so far.
            </p> */}
          <div className="max-w-xl w-full">
            <div className="flex mt-10 items-center space-x-3 ">
              <div
                className={
                  "dark:bg-gray-600 rounded-full p-1 mt-1 bg-gray-200 "
                }>
                <RiNumber1 className={""} />
              </div>
              <p className="text-left font-medium">
                confusing website url{" "}
                <span className="text-slate-500">
                  {/* (or any blog or article you want summarized!) */}
                </span>
                {/* . */}
              </p>
            </div>
            <textarea
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-700  shadow-lg dark:bg-gray-200 bg-gray-100 focus:border-1 dark:text-black focus:ring-black my-5"
              placeholder={"thislandingpagemakesnosense.com"}
            />
            <div className="flex flex-row gap-4  md:gap-8 justify-center mt-4">
              {!loading && (
                <button
                  className="custom-btn btn-3 text-lg font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    generateSummary();
                  }}
                >
                  <span>Explain &rarr;</span>
                </button>
              )}
              {loading && (
                <button
                  className="custom-btn btn-3 text-lg font-semibold"
                  disabled>
                  <LoadingDots color="white" style="large" />
                </button>
              )}
              {!randomizing && (
                <button
                  className="custom-btn btn-7 text-md font-semibold"
                  onClick={randomizeSite}>
                  <span>Random site &rarr;</span>
                </button>
              )}
              {randomizing && (
                <button
                  className="custom-btn btn-7 text-md font-semibold"
                  disabled>
                  <LoadingDots color="white" style="large" />
                </button>
              )}
            </div>
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="space-y-10 my-10">
                {generatedSummary && (
                  <>
                    <div>
                      <h2 className="sm:text-4xl dark:text-white text-3xl font-bold text-slate-900 mx-auto">
                        Your generated summary
                      </h2>
                    </div>
                    <div className="space-y-8 dark:text-white flex flex-col items-center justify-center max-w-xl mx-auto">
                      <div
                        className="rounded-xl dark:text-white p-4 dark:bg-gray-200 bg-gray-100 transition cursor-copy border text-md shadow-inner font-semibold text-left"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            generatedSummary.toString()
                          );
                          toast("Summary copied to clipboard", {
                            icon: "✂️",
                          });
                        }}>
                        <p className={"dark:text-black"}>{generatedSummary}</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            {latestSites && latestSites.length !== 0 && (
              <div className="px-2 py-2 rounded-lg my-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                  <div className=" px-4 py-4 text-center rounded-sm border-2 border-gray-400 shadow-xl sm:max-w-md sm:mx-auto sm:px-6">
                    <h2 className="text-3xl text-gray-900 font-medium mb-2 dark:text-gray-300">
                      Latest Searches
                    </h2>
                    <ul>
                      {latestSites.map((url, index) => (
                        <AnimatePresence key={`latest-site-${index}`}>
                          <motion.li
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-600"
                            key={`latest-site-${index}`}>
                            <button
                              onClick={() => handleLatestSiteClick(url)}
                              className="w-full px-4 p-2 mt-4 border-2 font-semibold dark:border-gray-300 border-gray-700 rounded-md flex text-black hover:bg-gray-200 dark:text-white
                              dark:hover:text-gray-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                              </svg>

                              {url}
                            </button>
                          </motion.li>
                        </AnimatePresence>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </ResizablePanel>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
