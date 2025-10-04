import { PaymentMethod } from './enums/enums';

export const APP_NAME = "Fetale digital"
export const PAYMENT_METHOD_STRING = {
  [PaymentMethod.Card]: "Cartão",
  [PaymentMethod.Pix]: "Pix",
  [PaymentMethod.Cash]: "Dinheiro",
}
