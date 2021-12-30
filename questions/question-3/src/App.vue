<template>
  <a-row>
    <a-col :xs="{ span: 22, offset: 1 }" :md="{ span: 18, offset: 3 }">
      <a-row style="margin: 1.2rem 0 0">
        <a-space direction="horizontal" size="middle">
          <a-form-item label="Filter by month">
            <a-select
              v-model:value="state.selected_month"
              style="width: 240px"
              :options="state.months_list"
              @change="handleMonthChange"
            ></a-select>
          </a-form-item>
          <a-form-item label="Filter by exchange">
            <a-select
              v-model:value="state.selected_exchange"
              style="width: 180px"
              :options="state.exchange_list"
              @change="handleExchangeChange"
            ></a-select>
          </a-form-item>
        </a-space>
      </a-row>
      <DataTable
        :table_columns="table_columns"
        :table_data="state.filtered_list"
      />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { compareDesc, format, subMonths } from "date-fns";
import FEED_DATA from "@/data/data_pricefeed.json";
import { Options, Vue } from "vue-class-component";
import { IFeedData, TDropdownItem } from "@/definitions";
import { CommonStore } from "@/store";
import DataTable from "@/components/DataTable.vue";

const table_columns = [
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "EXCHANGE",
    dataIndex: "exchange",
    className: "align--center",
    key: "exchange",
    width: 120,
  },
  {
    title: "CODE",
    dataIndex: "code",
    className: "align--center",
    key: "code",
    width: 120,
  },
  {
    title: "DATE ADDED",
    dataIndex: "dateAdded",
    className: "align--center",
    key: "dateAdded",
    width: 140,
  },
  {
    title: "PRICE ADDED",
    dataIndex: "priceAdded",
    className: "align--right",
    key: "pricedAdded",
    width: 160,
  },
  {
    title: "CURRENT PRICE",
    dataIndex: "priceCurrent",
    className: "align--right",
    key: "priceCurrent",
    width: 160,
  },
  {
    title: "CHANGE",
    dataIndex: "priceChange",
    className: "align--right",
    key: "priceChange",
    width: 160,
    ellipsis: true,
  },
];

const parsed_feed_data = FEED_DATA.map((data: IFeedData, idx: number) => ({
  ...data,
  key: `${idx}`,
}));

const filterFeedData = (type: string, value: string, list: IFeedData[]) => {
  return list.filter((feed_data: IFeedData) => {
    const { dateAdded, exchange } = feed_data;
    if (type === "month") {
      const month = format(new Date(dateAdded), "MMM");
      return month === value || value === "0";
    } else if (type === "exchange") {
      return exchange === value || value === "0";
    }
    return true;
  });
};

const compareFilteredData = (list_1: IFeedData[], list_2: IFeedData[]) => {
  return list_2.map((item, idx: number) =>
    Object.assign({}, item, list_1[idx])
  );
};

@Options({
  data() {
    return {
      compareFilteredData,
      filterFeedData,
      state: CommonStore.state,
      setSelectedExchange: CommonStore.setSelectedExchange,
      setFilterExchangeList: CommonStore.setFilteredExchangeList,
      setFilteredMonthList: CommonStore.setFilteredMonthList,
      setFilteredList: CommonStore.setFilteredList,
      setExchangeList: CommonStore.setExchangeList,
      setSelectedMonth: CommonStore.setSelectedMonth,
      setMonthsList: CommonStore.setMonthsList,
      table_columns,
    };
  },
  components: {
    DataTable,
  },
  mounted() {
    this.setFilteredList(parsed_feed_data);
    const exchange_list: TDropdownItem[] = [];
    const exchange_data: string[] = [];
    parsed_feed_data.forEach((feed_data: IFeedData) => {
      const { exchange } = feed_data;
      if (!exchange_data.includes(exchange)) {
        exchange_list.push({
          label: exchange,
          value: exchange,
        });
        exchange_data.push(exchange);
      }
    });
    this.setExchangeList([{ label: "Show all", value: "0" }, ...exchange_list]);
    const most_recent_available_date = parsed_feed_data
      .map((feed_data: IFeedData) => {
        const { dateAdded } = feed_data;
        return new Date(dateAdded);
      })
      .sort(compareDesc)[0];

    const months_list = [...Array(6).keys()]
      .map((idx: number) => subMonths(most_recent_available_date, idx))
      .sort(compareDesc)
      .map((month_data: Date) => {
        const month_label = format(month_data, "MMMM");
        const month_value = format(month_data, "MMM");
        return { label: month_label, value: month_value };
      });
    this.setMonthsList([{ label: "Show all", value: "0" }, ...months_list]);
    const session_selected_month = sessionStorage.getItem("selected_month");
    const session_selected_exchange =
      sessionStorage.getItem("selected_exchange");
    if (session_selected_month) {
      this.setSelectedMonth(session_selected_month);
      const getDataSource = () => {
        if (
          session_selected_exchange === "0" &&
          session_selected_month === "0"
        ) {
          return parsed_feed_data;
        } else if (session_selected_exchange) {
          return filterFeedData(
            "exchange",
            session_selected_exchange,
            parsed_feed_data
          );
        }
        return parsed_feed_data;
      };
      this.setFilteredMonthList(
        filterFeedData("month", session_selected_month, getDataSource())
      );
      this.setFilteredList(this.state.filtered_month_list);
    }
    if (session_selected_exchange) {
      this.setSelectedExchange(session_selected_exchange);
      const getDataSource = () => {
        if (
          session_selected_month === "0" &&
          session_selected_exchange === "0"
        ) {
          return parsed_feed_data;
        } else if (session_selected_month) {
          return filterFeedData(
            "month",
            session_selected_month,
            parsed_feed_data
          );
        }
        return parsed_feed_data;
      };
      this.setFilterExchangeList(
        filterFeedData("exchange", session_selected_exchange, getDataSource())
      );
      this.setFilteredList(this.state.filtered_exchange_list);
    }
  },
  methods: {
    handleExchangeChange(value: string) {
      sessionStorage.setItem("selected_exchange", value);
      const getDataSource = () => {
        if (this.state.selected_month === "0" && value === "0") {
          return parsed_feed_data;
        } else if (value === "0") {
          return this.state.filtered_month_list;
        }
        return filterFeedData(
          "month",
          this.state.selected_month,
          parsed_feed_data
        );
      };
      this.setFilterExchangeList(
        filterFeedData("exchange", value, getDataSource())
      );
      this.setFilteredList(this.state.filtered_exchange_list);
    },
    handleMonthChange(value: string) {
      sessionStorage.setItem("selected_month", value);
      const getDataSource = () => {
        if (this.state.selected_exchange === "0" && value === "0") {
          return parsed_feed_data;
        } else if (value === "0") {
          return this.state.filtered_exchange_list;
        }
        return filterFeedData(
          "exchange",
          this.state.selected_exchange,
          parsed_feed_data
        );
      };
      this.setFilteredMonthList(
        filterFeedData("month", value, getDataSource())
      );
      this.setFilteredList(this.state.filtered_month_list);
    },
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
.align {
  &--center {
    text-align: center !important;
  }
  &--right {
    text-align: right !important;
  }
}
</style>
