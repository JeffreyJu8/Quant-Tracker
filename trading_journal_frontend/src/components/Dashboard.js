import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [trades, setTrades] = useState([]);
    const [formData, setFormData] = useState({
        symbol: '',
        type: 'stock', // default type
        position: 'long', // default position
        entryDate: '',
        exitDate: '',
        expirationDate: '',
        strikePrice: '',
        quantity: '',
        fillPrice: '',
        closePrice: '',
        fee: '',
    });

    const { symbol, type, position, entryDate, exitDate, expirationDate, strikePrice, quantity, fillPrice, closePrice, fee } = formData;

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

    useEffect(() => {
        console.log('Updated Trades:', trades);
    }, [trades]);

    const calculatePL = () => {
        const fillTotal = parseFloat(fillPrice) * parseInt(quantity);
        const closeTotal = parseFloat(closePrice) * parseInt(quantity);
        let pl = closeTotal - fillTotal - parseFloat(fee);

        if (type === 'option') {
            pl *= 100;
        }
        
        // Adjust P/L for short position
        if (position === 'short') {
            pl = -pl;
        }
        console.log("returned P/L: ", pl)
        return pl;
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        let pl = calculatePL(); // This is now a number
        pl = parseFloat(pl).toFixed(2); // Ensure it's a number and then format it
        const tradeData = { ...formData, pl: pl };
        const res = await axios.post('/api/trades', tradeData, {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
            },
        });
        console.log('Response from backend:', res.data);
    
        setTrades([...trades, res.data]);
    };

    const deleteTrade = async (id) => {
        await axios.delete(`/api/trades/${id}`, {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
            },
        });
        setTrades(trades.filter(trade => trade._id !== id));
    };

    const getCumulativePLData = () => {
        let cumulativePL = 0;
        return trades.map((trade, index) => {
            cumulativePL += parseFloat(trade.pl);
            return {
                date: trade.exitDate || trade.entryDate,
                cumulativePL: cumulativePL.toFixed(2),
            };
        });
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
                
                <select name="position" value={position} onChange={onChange}>
                    <option value="long">Long</option>
                    <option value="short">Short</option>
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Symbol</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Type</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Position</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>P/L</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Entry Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Exit Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Entry Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Exit Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Fee</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(trade => (
                        <tr key={trade._id} style={{ color: trade.pl < 0 ? 'red' : 'green' }}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.symbol}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.type}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.position}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.pl}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.quantity}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.fillPrice}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.closePrice}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.entryDate}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.exitDate}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{trade.fee}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => deleteTrade(trade._id)} style={{ color: 'red' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>P/L Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={getCumulativePLData()}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cumulativePL" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Dashboard;
