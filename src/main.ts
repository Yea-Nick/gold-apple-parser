import { Reader } from "./Reader";
import { ProductParser } from "./ProductParser";

async function main() {
  try {
    const reader = new Reader();
    const cookie = await reader.getCookie();
    const links = await reader.getProductLinks();
    console.log(cookie);

    console.log(`Total products to parse: ${links.length}`);
    for (const link of links) {
      const parser = new ProductParser(link, cookie);
      const data = await parser.getData();
      await reader.writeProducts(data);
      console.log(`Parsed: ${data}`);
    }
    console.log(`Finised`);
  } catch (err) {
    console.log(err);
  }
}

main();