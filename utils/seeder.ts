import { ProductPriceDTO } from '../types/price.type';

const eifelDK: ProductPriceDTO = {
  id: '10307',
  name: 'Eifel Tower',
  region: 'DK',
  currency: 'DKK',
  centValue: 489900,
  validFrom: '1668466800',
};

const eifelUS: ProductPriceDTO = {
  id: '10307',
  name: 'Eifel Tower',
  region: 'US',
  currency: 'USD',
  centValue: 62999,
  validFrom: '1668466800',
};

const titanicDK: ProductPriceDTO = {
  id: '10294',
  name: 'Eifel Tower',
  region: 'DK',
  currency: 'DKK',
  centValue: 529900,
  validFrom: '1668466800',
};

export const productsForSeeding = [eifelDK, eifelUS, titanicDK];
