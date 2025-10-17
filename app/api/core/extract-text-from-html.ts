import { htmlToText } from "html-to-text";

export const extractTextFromHTML = (html: string): string => {
  return htmlToText(html, {
    wordwrap: 130,
  });
};

