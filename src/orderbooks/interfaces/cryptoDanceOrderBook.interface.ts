import { CryptoDanceOrderInterface } from './cryptoDanceOrder.interface';

export interface CryptoDanceOrderbookInterface {
  bids: Array<CryptoDanceOrderInterface>;
  asks: Array<CryptoDanceOrderInterface>;
}
