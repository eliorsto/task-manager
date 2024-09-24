import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PieCharts = ({ data = [], chartConfig }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="done"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          labelLine={false}
          label={({ name, percent }) => {
            const percentage = (percent * 100).toFixed(1);
            return `${name}: ${percentage}%`;
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartConfig[entry.done]?.color || "#000"} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}`, chartConfig[name]?.label || name]}
          labelStyle={{ color: '#6b7280' }}
          itemStyle={{ color: '#4b5563' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieCharts;
