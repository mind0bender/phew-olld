import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

function mdToHtml(md: string): Promise<string> {
  return new Promise(
    (
      resolve: (value: string) => void,
      reject: (reason?: any) => void
    ): void => {
      const html:Promise<void> = unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(md)
        .then((data): void => {
          resolve(data.toString());
        })
        .catch(reject);
    }
  );
}

export default mdToHtml;
