export type TDropdownItem = {
  label: string | number;
  value: string | number;
};

export interface IFeedData {
  code: string;
  name: string;
  exchange: string;
  priceCurrent: number;
  priceAdded: number;
  currency: string;
  dateAdded: string;
}