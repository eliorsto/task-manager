import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BarCharts = ({ data = [], chartConfig }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis
          dataKey="done"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={{ stroke: "#ccc" }}
          tickFormatter={(value) => chartConfig[value]?.label || value}
          style={{ fontSize: "14px", fill: "#333" }}
        />
        <XAxis type="number" hide />
        <Tooltip
          formatter={(value, name) => [`Hours: ${value}`, chartConfig[name]?.label || name]}
          labelStyle={{ color: "#6b7280" }}
          itemStyle={{ color: "#4b5563" }}
        />
        <Bar dataKey="value" radius={5}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartConfig[entry.done]?.color || "#8884d8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarCharts;