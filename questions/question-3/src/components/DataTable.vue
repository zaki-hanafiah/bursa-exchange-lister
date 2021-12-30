<template>
  <a-table bordered :columns="table_columns" :data-source="table_data">
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.dataIndex === 'name'">
        <strong>{{ text }}</strong>
      </template>
      <template v-if="column.dataIndex === 'priceChange'">
        <span :class="[getStatusColor(record.priceCurrent, record.priceAdded)]"
          >{{ getChangeDiff(record.priceCurrent, record.priceAdded) }} ({{
            getPercentageDiff(record.priceCurrent, record.priceAdded)
          }})</span
        >
      </template>
      <template v-if="column.dataIndex === 'priceAdded'">
        <span>{{ `${record.currency} ${record.priceAdded}` }}</span>
      </template>
      <template v-if="column.dataIndex === 'priceCurrent'">
        <span>{{ `${record.currency} ${record.priceCurrent}` }}</span>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

const getStatusColor = (priceCurrent: number, priceAdded: number) => {
  const change_diff = Number(getChangeDiff(priceCurrent, priceAdded));
  if (change_diff === 0) {
    return "status--normal";
  }
  return change_diff < 0 ? "status--red" : "status--green";
};

const getChangeDiff = (priceCurrent: number, priceAdded: number) =>
  Number(priceCurrent - priceAdded).toFixed(2) || "-";

const getPercentageDiff = (priceCurrent: number, priceAdded: number) => {
  const value_diff = Math.abs((priceCurrent / priceAdded - 1) * 100).toFixed(2);
  return `${value_diff}%`;
};

@Options({
  props: {
    table_data: Array,
    table_columns: Array,
  },
  methods: {
    getChangeDiff: (priceCurrent: number, priceAdded: number) =>
      getChangeDiff(priceCurrent, priceAdded),
    getPercentageDiff: (priceCurrent: number, priceAdded: number) =>
      getPercentageDiff(priceCurrent, priceAdded),
    getStatusColor: (priceCurrent: number, priceAdded: number) =>
      getStatusColor(priceCurrent, priceAdded),
  },
})
export default class DataTable extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.status {
  &--normal {
    color: dimgrey;
  }
  &--red {
    color: orangered;
  }
  &--green {
    color: forestgreen;
  }
}
</style>