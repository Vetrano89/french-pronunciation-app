// import { useEffect } from 'react';
// export const googleTranslate = require("google-translate")(apiKey);

// function translateText(text) {
//     return googleTranslate.translate(text, 'en', function(err, translation) {
//         console.log(translation.translatedText);
//         return translation.translatedText;
//         });
// }

// export function useTranslateText(text) {
//     let json;
//     async function fetchUrl() {
//       const response = await translateText(text);
//       json = await response.json();
//     }
//     useEffect(() => {
//       fetchUrl();
//     }, []);
//     return json;
//   }