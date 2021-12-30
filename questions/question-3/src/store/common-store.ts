import { reactive } from "vue";
import { TDropdownItem } from "@/definitions";

export const CommonStore = {
  state: reactive({
    exchange_list: [] as TDropdownItem[],
    months_list: [] as TDropdownItem[],
    selected_exchange: "" as string,
    selected_month: "" as string,
  }),

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setSelectedExchange(exchange: string) {
    this.state.selected_exchange = exchange;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setExchangeList(exchange_list: TDropdownItem[]) {
    this.state.exchange_list = exchange_list;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setSelectedMonth(month: string) {
    this.state.selected_month = month;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setMonthsList(months: TDropdownItem[]) {
    this.state.months_list = months;
  },
};
