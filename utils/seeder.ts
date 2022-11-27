import { ProductPriceDTO } from '../types/price.type';
import { v4 as uuidv4 } from 'uuid';

const eifelDK: ProductPriceDTO = {
  productId: '10307',
  priceId: uuidv4(),
  name: 'Eifel Tower',
  region: 'DK',
  currency: 'DKK',
  centValue: 489900,
  validFrom: '1668466800',
};

const eifelUS: ProductPriceDTO = {
  productId: '10307',
  name: 'Eifel Tower',
  priceId: uuidv4(),
  region: 'US',
  currency: 'USD',
  centValue: 62999,
  validFrom: '1668466800',
};

const titanicDK: ProductPriceDTO = {
  productId: '10294',
  name: 'Eifel Tower',
  priceId: uuidv4(),
  region: 'DK',
  currency: 'DKK',
  centValue: 529900,
  validFrom: '1668466800',
};

export const productsForSeeding = [eifelDK, eifelUS, titanicDK];
