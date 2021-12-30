import { createApp } from "vue";
import { Spin, Space, Col, Row, Table, Select } from "ant-design-vue";
import App from "./App.vue";

const app = createApp(App);
app.use(Row);
app.use(Col);
app.use(Select);
app.use(Space);
app.use(Spin);
app.use(Table);

app.mount("#app");
