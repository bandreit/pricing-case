export interface ProductPriceDTO {
  id: string;
  name: string;
  region: string;
  priceId: string;
  currency: string;
  centValue: number;
  validFrom: string;
  validTo?: string;
}
