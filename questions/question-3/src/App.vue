<template>
  <a-row>
    <a-col :xs="{ span: 22, offset: 1 }" :md="{ span: 18, offset: 3 }">
      <DataTable :table_columns="table_columns" :table_data="table_data" />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import FEED_DATA from "./data/data_pricefeed.json";
import { Options, Vue } from "vue-class-component";
import DataTable from "@/components/DataTable.vue";

interface IFeedData {
  code: string;
  name: string;
  exchange: string;
  priceCurrent: number;
  priceAdded: number;
  currency: string;
  dateAdded: string;
}

const table_columns = [
  {
    title: "NAME",
    dataIndex: "name",
    className: "align-center",
    key: "name",
  },
  {
    title: "EXCHANGE",
    dataIndex: "exchange",
    className: "align-center",
    key: "exchange",
    width: 120,
    ellipsis: true,
  },
  {
    title: "CODE",
    dataIndex: "code",
    className: "align-center",
    key: "code",
    width: 120,
    ellipsis: true,
  },
  {
    title: "DATE ADDED",
    dataIndex: "dateAdded",
    className: "align-center",
    key: "dateAdded",
    width: 140,
    ellipsis: true,
  },
  {
    title: "PRICE ADDED",
    dataIndex: "priceAdded",
    className: "align-right",
    key: "pricedAdded",
    width: 160,
    ellipsis: true,
  },
  {
    title: "CURRENT PRICE",
    dataIndex: "priceCurrent",
    className: "align-right",
    key: "priceCurrent",
    width: 160,
    ellipsis: true,
  },
  {
    title: "CHANGE",
    dataIndex: "priceChange",
    className: "align-right",
    key: "priceChange",
    width: 160,
    ellipsis: true,
  },
];

const parsed_feed_data = FEED_DATA.map((data: IFeedData, idx: number) => ({
  ...data,
  key: `${idx}`,
}));

@Options({
  data() {
    return {
      table_data: parsed_feed_data as IFeedData[],
      table_columns,
    };
  },
  components: {
    DataTable,
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
  &-center {
    text-align: center !important;
  }
  &-right {
    text-align: right !important;
  }
}
</style>
