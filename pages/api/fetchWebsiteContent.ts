import { NextApiRequest, NextApiResponse } from 'next';
import { encode, decode } from "gpt-3-encoder";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { url } = (await req.body) as {
        url?: string;
    };

    if (!url) {
        return res.status(400).send("No URL in request");
    }

    try {
        const response = await fetch(`https://www.w3.org/services/html2txt?url=${encodeURIComponent(url)}&noinlinerefs=on&nonums=on`);
        if (response.status === 200) {
        const siteText = await response.text();

        if (siteText.length <= 200) {
            return res.send(siteText);
        }
        // siteText = Buffer.from(siteText, 'utf-8').toString()
        const trimmed = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim()
        console.log(trimmed)
        let encoded = encode(trimmed);
        encoded = encoded.slice(0, 3500);
        const encodedSiteText = decode(encoded);
        console.log("decoded", encodedSiteText)
        return res.send(encodedSiteText);
    } else {
        return res.status(400).send("Bad Response")
    }
    } catch (error) {
        return res.status(400).send("Unexpected Error Occurred");
    }
}

export default handler;


// import { NextApiRequest, NextApiResponse } from 'next';
// import { encode, decode } from "gpt-3-encoder";

// const handler = async (req: Request): Promise<Response> => {
//     console.log(req)
//     const { url } = (await req.json()) as {
//       url?: string;
//     };
//     console.log(url)
//     if (!url) {
//       return new Response(null, {
//         status: 400,
//         statusText: "No URL in request"
//       });
//     }

//     try {

//         const res = await fetch(
//             `https://www.w3.org/services/html2txt?url=${encodeURIComponent(
//                 url
//             )}&noinlinerefs=on&nonums=on`
//         );
//         console.log("html response", res)
//         if (res.status === 200) {
//             let siteText = await res.text();
//             console.log(siteText)
//             if (siteText.length > 200) {
//                 // The result is valid
//                 if (siteText.length > 400) {
//                     siteText = Buffer.from(siteText, 'utf-8').toString()
//                     siteText = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim()
//                     console.log("trimmed", siteText)
//                     let encoded = encode(siteText)
//                     encoded = encoded.slice(0, 4000)
//                     siteText = decode(encoded)
//                 }
//             } else {
//             return new Response(siteText)
//             }
//         }
//         return new Response(null, {
//             status: 400,
//             statusText: "Website content too short"
//         });
//     }
//     catch (error) {
//         return new Response(null, {
//             status: 400,
//             statusText: "Unexpected Error Occured"
//         });
//     }
// }

// export default handler;



// import { NextApiRequest, NextApiResponse } from 'next';
// import { encode, decode } from "gpt-3-encoder";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   return new Promise(async (resolve, reject) => {
//     const { url } = req.body;

//     try {
//       const response = await fetch(
//         `https://www.w3.org/services/html2txt?url=${encodeURIComponent(
//           url
//         )}&noinlinerefs=on&nonums=on`,
//       );
      
//       if (response.status === 200) {
//         let siteText = await response.text();
        
//         if (siteText.length > 200) {
//           // The result is valid
//           if (siteText.length > 400) {
//             siteText = Buffer.from(siteText, 'utf-8').toString()
//             siteText = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim()
//             let encoded = encode(siteText)
//             encoded = encoded.slice(0, 4000)
//             siteText = decode(encoded)
//           }
//           resolve(siteText);
//         } else {
//           reject(new Error('Site text is too short'));
//         }
//       } else {
//         reject(new Error('Invalid response from server'));
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
