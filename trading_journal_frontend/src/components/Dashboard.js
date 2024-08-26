import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [trades, setTrades] = useState([]);
    const [formData, setFormData] = useState({
        symbol: '',
        type: '',
        quantity: '',
        price: '',
    });

    const { symbol, type, quantity, price } = formData;

    useEffect(() => {
        const fetchTrades = async () => {
            const res = await axios.get('/api/trades', {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            setTrades(res.data);
        };
        fetchTrades();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const res = await axios.post('/api/trades', formData, {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
            },
        });
        setTrades([...trades, res.data]);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <form onSubmit={onSubmit}>
                <input type="text" name="symbol" value={symbol} onChange={onChange} placeholder="Symbol" required />
                <input type="text" name="type" value={type} onChange={onChange} placeholder="Type (stock/option)" required />
                <input type="number" name="quantity" value={quantity} onChange={onChange} placeholder="Quantity" required />
                <input type="number" name="price" value={price} onChange={onChange} placeholder="Price" required />
                <button type="submit">Add Trade</button>
            </form>

            <h2>Your Trades</h2>
            <ul>
                {trades.map(trade => (
                    <li key={trade._id}>
                        {trade.symbol} - {trade.type} - {trade.quantity} @ {trade.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
