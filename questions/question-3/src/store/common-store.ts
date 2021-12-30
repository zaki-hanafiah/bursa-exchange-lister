import { reactive } from "vue";
import { IFeedData, TDropdownItem } from "@/definitions";

export const CommonStore = {
  state: reactive({
    filtered_list: [] as IFeedData[],
    exchange_list: [] as TDropdownItem[],
    months_list: [] as TDropdownItem[],
    selected_exchange: "0" as string,
    selected_month: "0" as string,
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setFilteredList(feed_data: IFeedData[]) {
    this.state.filtered_list = feed_data;
  },
};
