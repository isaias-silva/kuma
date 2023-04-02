


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const data = [
    { name: 'Janeiro', vendas: 2000 },
    { name: 'Fevereiro', vendas: 3000 },
    { name: 'Março', vendas: 5000 },
    { name: 'Abril', vendas: 7000 },
    { name: 'Maio', vendas: 6000 },
    { name: 'Junho', vendas: 8000 },
];

export default function Graph() {
    return (
        <LineChart
            width={500}
            height={200}
            data={data}
            style={{ margin: 'auto' }}

        >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="vendas" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );

}
