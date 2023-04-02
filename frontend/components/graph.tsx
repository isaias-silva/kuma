


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


type dataGraph =
    {
        name: string,
        val: { key: string, value: number }
    }
export default function Graph({ dataKey, data }: {
    dataKey: string,
    data: dataGraph[]

}) {
    const formatData = data.map((value) => {
        const { val, name } = value
        const string = `{"name":"${name}","${val['key']}":${JSON.stringify(val['value'])}}`;

        const obj = JSON.parse(string);

        return obj

    })

    return (
        <LineChart

            width={500}
            height={200}
            data={formatData}
            style={{
                margin: 'auto',
                background: '#000000ba',
                color: '#fff',
                padding: '10px',
                borderRadius: '20px'
            }}

        >
            <XAxis tick={{ fill: '#31669c' }} dataKey="name" />
            <YAxis tick={{ fill: '#31669c' }} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend color='blue' />
            <Line type="monotone" color='#ffffff' dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );

}
