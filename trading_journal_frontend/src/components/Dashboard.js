import React, { useState, useEffect } from 'react';
import axios from 'axios';
// You can use Chart.js or Recharts for graphing
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [trades, setTrades] = useState([]);
    const [formData, setFormData] = useState({
        symbol: '',
        type: 'stock', // default type
        entryDate: '',
        exitDate: '',
        expirationDate: '',
        strikePrice: '',
        quantity: '',
        fillPrice: '',
        closePrice: '',
        fee: '',
    });

    const { symbol, type, entryDate, exitDate, expirationDate, strikePrice, quantity, fillPrice, closePrice, fee } = formData;

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

    const calculatePL = () => {
        const fillTotal = parseFloat(fillPrice) * parseInt(quantity);
        const closeTotal = parseFloat(closePrice) * parseInt(quantity);
        const pl = closeTotal - fillTotal - parseFloat(fee);
        return pl.toFixed(2); // returns P/L rounded to 2 decimal places
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const tradeData = { ...formData, pl: calculatePL() };
        const res = await axios.post('/api/trades', tradeData, {
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
                <input type="text" name="symbol" value={symbol} onChange={onChange} placeholder="Ticker Symbol" required />
                <select name="type" value={type} onChange={onChange}>
                    <option value="stock">Stock</option>
                    <option value="option">Option</option>
                </select>

                {type === 'option' && (
                    <>
                        <input type="date" name="entryDate" value={entryDate} onChange={onChange} placeholder="Entry Date" required />
                        <input type="date" name="expirationDate" value={expirationDate} onChange={onChange} placeholder="Expiration Date" required />
                        <input type="date" name="exitDate" value={exitDate} onChange={onChange} placeholder="Exit Date" required />
                        <input type="number" name="strikePrice" value={strikePrice} onChange={onChange} placeholder="Strike Price ($)" required />
                        <input type="number" name="quantity" value={quantity} onChange={onChange} placeholder="Quantity" required />
                        <input type="number" name="fillPrice" value={fillPrice} onChange={onChange} placeholder="Fill Price ($)" required />
                        <input type="number" name="closePrice" value={closePrice} onChange={onChange} placeholder="Close Price ($)" required />
                        <input type="number" name="fee" value={fee} onChange={onChange} placeholder="Fee ($)" required />
                    </>
                )}

                {type === 'stock' && (
                    <>
                        <input type="datetime-local" name="entryDate" value={entryDate} onChange={onChange} placeholder="Entry Date and Time" required />
                        <input type="datetime-local" name="exitDate" value={exitDate} onChange={onChange} placeholder="Exit Date and Time" required />
                        <input type="number" name="quantity" value={quantity} onChange={onChange} placeholder="Quantity" required />
                        <input type="number" name="fillPrice" value={fillPrice} onChange={onChange} placeholder="Fill Price ($)" required />
                        <input type="number" name="closePrice" value={closePrice} onChange={onChange} placeholder="Exit Price ($)" required />
                        <input type="number" name="fee" value={fee} onChange={onChange} placeholder="Fee ($)" required />
                    </>
                )}
                <button type="submit">Add Trade</button>
            </form>

            <h2>Your Trades</h2>
            <ul>
                {trades.map(trade => (
                    <li key={trade._id} style={{ color: trade.pl < 0 ? 'red' : 'green' }}>
                        {trade.symbol} - {trade.type} - P/L: {trade.pl} - {trade.quantity} @ {trade.fillPrice} - Exit: {trade.closePrice}
                    </li>
                ))}
            </ul>

            <h2>P/L Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={trades.map(trade => ({ date: trade.exitDate || trade.entryDate, pl: trade.pl }))}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pl" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Dashboard;
