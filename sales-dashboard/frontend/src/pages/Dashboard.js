import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Enero", ventas: 4000 },
  { name: "Febrero", ventas: 3000 },
  { name: "Marzo", ventas: 5000 },
];

export default function Dashboard() {
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-5">Dashboard de Ventas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
