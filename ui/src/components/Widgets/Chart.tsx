import {PieChart, Pie, ResponsiveContainer} from "recharts";
import {WebSocketObject} from "../myTypes";

function calcSize(obj: WebSocketObject) {
  if (typeof obj.spec != "undefined") {
    var ret = parseFloat(
      obj.spec.resources.requests.storage.replace(/\D/g, "")
    );
    return ret;
  }
  return 0;
}

function getStorageRequests(volumes: WebSocketObject[]) {
  var dataRequests = [{}];
  volumes.forEach((element) => {
    dataRequests = [
      ...dataRequests,
      {name: element.metadata.name, value: calcSize(element)},
    ];
  });
  return dataRequests;
}

type Props = {
  volumes: WebSocketObject[];
};
export default function Chart({volumes}: Props) {
  const dataRequests = getStorageRequests(volumes);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart width={400} height={100}>
        <Pie
          data={dataRequests}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
        />
        {/* <Pie
          data={data02}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#82ca9d"
          label
        /> */}
      </PieChart>
    </ResponsiveContainer>
  );
}
