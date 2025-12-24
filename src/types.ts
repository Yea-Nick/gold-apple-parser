export interface Product {
    data: ProductData;
}

interface ProductData {
    id: string;
    itemId: string;
    name: string;
    mainVariantProductId: string;
    type: string;
    isAdult: boolean;
    configurable: boolean;
    brand: string;
    brandUrl: string;
    productType: string;
    variants: ProductVariant[];
}

export interface ProductVariant {
    itemId: string;
    attributesValue: {
        units: string;
        colors: string;
    };
    imageUrls: ProductImage[];
    url: string;
    inStock: boolean;
    price: ProductPriceData;
}

interface ProductImage {
    url: string; //Ends with ${screen}.${format}
    format: ProductImageFormat[];
    screen: ProductImageScreen[];
}

type ProductImageFormat = "webp" | "jpg";
type ProductImageScreen = "fullhd";

interface ProductPriceData {
    regular: ProductPrice;
    loyalty: ProductPrice;
    actual: ProductPrice;
    old: ProductPrice;
    viewOptions: ProductPriceViewOptions;
}

interface ProductPrice {
    amount: number;
    currency: ProductPriceCurreny;
    denominator: number;
}

interface ProductPriceViewOptions {
    priceFrom: boolean;
    crossPrice: boolean;
    useDiscount: boolean;
    discountPercent: number;
    type: string;
}

export enum ProductPriceType {
    Actual = "actual",
    Old = "old",
    BestLoyalty = "bestLoyalty",
}

type ProductPriceCurreny = "RUB" | "BYN" | "KZT";

export enum Region {
    RU = "RU",
    BY = "BY",
    KZ = "KZ",
}

export enum CityId {
    RU = "0c5b2444-70a0-4932-980c-b4dc0d3f02b5", //Moscow
    BY = "relation:59195&regionId=relation:59195",  //Minsk
    KZ = "4c26ad1c-ca49-4fc1-af64-f540c6a873e4&regionId=4da8e628-6856-4e32-95df-60fa493549b8",  //Almati
}

export enum DomainZone {
    RU = "ru",
    BY = "by",
    KZ = "kz",
}

export enum ProductPriceCurrenyRendered {
    RU = "р.",
    BY = "",
    KZ = "₸",
}