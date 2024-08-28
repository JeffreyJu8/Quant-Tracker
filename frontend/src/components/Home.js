import React from 'react';
import './Style/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <nav className="container-fluid">
                <ul className="nav-left">
                    <li><strong>Quant Tracker</strong></li>
                </ul>
                <ul className="nav-middle">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
                <ul className="nav-right">
                    <li><Link to="/login" role="button">Login</Link></li>
                    <li><Link to="/register" role="button">Register</Link></li>
                </ul>
            </nav>

            <main className="container">
                <div className="grid">
                    <section>
                        <hgroup>
                            <h2>Welcome to Quant Tracker</h2>
                            <h3>Your ultimate trading journal</h3>
                        </hgroup>
                        <p>Quant Tracker helps traders keep a detailed record of all their trades, analyze their performance, and improve their strategies.</p>
                        <h3>Track Your Trades</h3>
                        <p>With Quant Tracker, you can easily log all your trades, including entry and exit points, strategies used, and the outcome of each trade.</p>
                        <h3>Analyze Performance</h3>
                        <p>Gain insights into your trading patterns and performance metrics to identify strengths and areas for improvement.</p>
                        <h3>Optimize Strategies</h3>
                        <p>Use the data and analytics provided by Quant Tracker to refine and optimize your trading strategies for better results.</p>
                    </section>
                </div>
            </main>

            <section aria-label="Subscribe example" id="subscribe">
                <div className="container">
                    <article>
                        <hgroup>
                            <h2>Stay Updated</h2>
                            <h3>Subscribe to our newsletter</h3>
                        </hgroup>
                        <form className="grid">
                            <input type="text" id="firstname" name="firstname" placeholder="Your First Name" aria-label="First Name" required />
                            <input type="email" id="email" name="email" placeholder="Your Email Address" aria-label="Email Address" required />
                            <button type="submit" onClick={(e) => e.preventDefault()}>Subscribe</button>
                        </form>
                    </article>
                </div>
            </section>

            <footer className="container">
                <small><a href="#about">About</a> • <a href="#features">Features</a></small>
            </footer>
        </div>
    );
};

export default Home;
