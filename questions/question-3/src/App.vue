<template>
  <a-row>
    <a-col :xs="{ span: 22, offset: 1 }" :md="{ span: 18, offset: 3 }">
      <a-row style="margin: 1.2rem 0">
        <a-space direction="horizontal" size="middle">
          <a-form-item label="Filter by month">
            <a-select
              v-model:value="state.selected_month"
              style="width: 400px"
              :options="state.months_list"
              @change="handleMonthChange"
            ></a-select>
          </a-form-item>
          <a-form-item label="Filter by exchange">
            <a-select
              v-model:value="state.selected_exchange"
              style="width: 400px"
              :options="state.exchange_list"
              @change="handleExchangeChange"
            ></a-select>
          </a-form-item>
        </a-space>
      </a-row>
      <DataTable :table_columns="table_columns" :table_data="table_data" />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { compareDesc, format, getMonth, subMonths } from "date-fns";
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

const parsed_feed_data = FEED_DATA.map((data: IFeedData) => ({
  ...data,
  key: data.code,
}));

const handleExchangeChange = (value: string) => {
  sessionStorage.setItem("selected_exchange", value);
  // do filtering here
  console.log(
    parsed_feed_data.filter((feed_data: IFeedData) => {
      const { exchange } = feed_data;
      return exchange === value || value === "0";
    })
  );
};

const handleMonthChange = (value: string) => {
  sessionStorage.setItem("selected_month", value);
  // do filtering here
  console.log(
    parsed_feed_data.filter((feed_data: IFeedData) => {
      const { dateAdded } = feed_data;
      const month = format(new Date(dateAdded), "MMM");
      return month === value || value === "0";
    })
  );
};

@Options({
  data() {
    return {
      handleExchangeChange,
      handleMonthChange,
      state: CommonStore.state,
      setSelectedExchange: CommonStore.setSelectedExchange,
      setFilteredList: CommonStore.setFilteredList,
      setExchangeList: CommonStore.setExchangeList,
      setSelectedMonth: CommonStore.setSelectedMonth,
      setMonthsList: CommonStore.setMonthsList,
      table_data: parsed_feed_data as IFeedData[],
      table_columns,
    };
  },
  components: {
    DataTable,
  },
  mounted() {
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
      // do filtering here
    }
    if (session_selected_exchange) {
      this.setSelectedExchange(session_selected_exchange);
      console.log(
        parsed_feed_data.filter((feed_data: IFeedData) => {
          const { exchange } = feed_data;
          return (
            exchange === session_selected_exchange ||
            session_selected_exchange === "0"
          );
        })
      );
      // do filtering here
    }
    console.log(this.state);
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
  margin-top: 60px;
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
