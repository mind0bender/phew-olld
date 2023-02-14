import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

function mdToHtml(md: string): Promise<string> {
  return new Promise(
    (
      resolve: (value: string) => void,
      reject: (reason?: any) => void
    ): void => {
      const html = unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(md)
        .then((data): void => {
          console.log(data.toString());
          resolve(data.toString());
        })
        .catch(reject);
      console.log(String(html));
    }
  );
}

export default mdToHtml;
