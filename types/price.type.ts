export interface ProductPriceDTO {
  id: string;
  name: string;
  region: string;
  currency: string;
  centValue: number;
  validFrom: string;
  validTo?: string;
}
