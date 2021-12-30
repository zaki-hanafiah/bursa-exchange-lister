import { createApp } from "vue";
import { Spin, Col, Row, Table, Select } from "ant-design-vue";
import App from "./App.vue";

const app = createApp(App);
app.use(Row);
app.use(Col);
app.use(Select);
app.use(Spin);
app.use(Table);

app.mount("#app");
