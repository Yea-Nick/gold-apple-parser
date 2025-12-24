import fs from 'fs/promises';

export class Reader {
    private readonly path = './files';

    constructor() { }

    async getCookie() {
        return (await fs.readFile(`${this.path}/cookie.txt`, 'utf-8')).toString();
    }

    async getProductLinks() {
        return (await fs.readFile(`${this.path}/links.txt`, 'utf-8')).split('\n');
    }

    async writeProducts(data: string) {
        return await fs.appendFile(`${this.path}/products.txt`, `\n${data}`);
    }
}