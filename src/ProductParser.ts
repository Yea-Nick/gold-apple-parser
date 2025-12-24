import { CityId, DomainZone, Product, ProductPriceCurrenyRendered, ProductPriceType, ProductVariant, Region } from "./types";

export class ProductParser {
    private readonly DOMAIN_NAME = "goldapple";

    private readonly IMAGE_FORMAT = "jpg";
    private readonly IMAGE_SCREEN = "fullhd";

    private readonly productSku: string;
    private readonly region: Region;

    constructor(private readonly link: string, private readonly cookie: string) {
        this.productSku = this.getProductSku();
        this.region = this.getRegion();
    }

    async getData() {
        try {
            const {
                data: { productType: productTypeCC, brand: brandCC, name: nameCC, variants },
            } = await this.fetchApi<Product>(this.getApiUrl());

            const variant = variants.filter((e) => e.itemId === this.productSku)[0];
            if (!variant) throw new Error(`No such variant with SKU: ${this.productSku}`);

            const image = this.getProductImage(variant);
            if (!image) throw new Error(`No image: ${image}`);

            const productType = productTypeCC.toUpperCase();
            const brand = brandCC.toUpperCase();
            const name = nameCC.toLowerCase();
            const brandAndName = `${brand} ${name}`;

            const { oldPrice, actualPrice } = this.getPrice(variant);

            return [productType, brand, name, brandAndName, actualPrice, oldPrice, this.productSku, image].join(';');
        } catch (err) {
            throw new Error(`Product Parser | Get data | ${err}`);
        }
    }

    private async fetchApi<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url, {
                headers: {
                    cookie: this.cookie
                },
            }).then((res) => res.json());
            if (!response) throw new Error(`No response`);

            return response;
        } catch (err) {
            if (err
                && typeof err === 'object'
                && 'message' in err
                && typeof err.message === 'string'
                && err.message.includes('Unexpected token')) {
                throw new Error(`Fetch API | Invalid cookies`);
            }
            throw new Error(`Fetch API | ${err}`);
        }
    }

    private getProductSku() {
        return new URL(this.link).pathname.split("-")[0].slice(1);
    }

    private getApiUrl() {
        try {
            const cityId = CityId[this.region];
            if (!cityId) throw new Error(`Unknown region: ${this.region}`);

            const domainZone = DomainZone[this.region];
            if (!domainZone) throw new Error(`Unknown domain zone: ${domainZone}`);

            return `https://${this.DOMAIN_NAME}.${domainZone}/front/api/catalog/product-card/base/v2?locale=ru&itemId=${this.productSku}&cityId=${cityId}`;
        } catch (err) {
            throw new Error(`Get API URL | ${err}`);
        }
    }

    private getRegion() {
        try {
            const region = this.link.split(`https://${this.DOMAIN_NAME}.`)[1].slice(0, 2).toUpperCase();

            if (!Object.values<string>(Region).includes(region)) {
                throw new Error(`Unknown region: ${region}`);
            }

            return region as Region;
        } catch (err) {
            throw new Error(`Get region | ${err}`);
        }
    }

    private getProductImage(variant: ProductVariant) {
        return variant.imageUrls[0].url.replace("${screen}.${format}", `${this.IMAGE_SCREEN}.${this.IMAGE_FORMAT}`);
    }

    private getPrice({ price }: ProductVariant) {
        try {
            const type = price.viewOptions.type;
            const useDiscount = price.viewOptions.useDiscount;
            const crossPrice = price.viewOptions.crossPrice;

            const oldPrice = this.formatPrice(type === ProductPriceType.Old && useDiscount && crossPrice ? price.old.amount / price.old.denominator : "");
            const actualPrice = this.formatPrice(price.actual.amount / price.actual.denominator);

            return {
                oldPrice,
                actualPrice,
            };
        } catch (err) {
            throw new Error(`Get price | ${err}`);
        }
    }

    private formatPrice(price: number | string) {
        try {
            if (typeof price === "string") return "";

            let priceFormatted: string;
            let [intPart, decimalPart] = price.toString().split(".");

            if (intPart.length > 3) {
                const indx = intPart.length - 3;
                intPart = intPart.substring(0, indx) + " " + intPart.substring(indx);
            }
            priceFormatted = intPart;

            if (decimalPart) priceFormatted += `,${decimalPart}`;

            priceFormatted += ` ${ProductPriceCurrenyRendered[this.region]}`;

            return priceFormatted.trim();
        } catch (err) {
            throw new Error(`Format price | ${err}`);
        }
    }
}