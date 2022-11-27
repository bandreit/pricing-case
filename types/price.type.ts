export interface ProductPriceDTO {
  productId: string;
  name: string;
  region: string;
  priceId: string;
  currency: string;
  centValue: number;
  validFrom: string;
  validTo?: string;
}

export interface ProductPriceDbDoc {
  pk: string;
  sk: string;
  region: string;
  currency: string;
  centValue: number;
  validFrom: string;
  validTo?: string;
}

export interface PricePayload {
  region: string;
  currency: string;
  centValue: number;
  validFrom: string;
}
