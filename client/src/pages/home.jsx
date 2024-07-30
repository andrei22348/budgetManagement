import React from "react";
import '../public/home.css';
import { NavLink } from "react-router-dom";

const Home = () => {
  return (

    <div className="homepage">
      <HeroSection />
      <FeatureHighlights />
      <HowItWorks />
      <Testimonials />
    </div>

  );
};

const HeroSection = () => (
  <section className="hero">
    <h1>Welcome to Budget Manager</h1>
    <p>Take control of your finances with ease.</p>
    <button>
      <NavLink to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
        Get Started
      </NavLink>
    </button>
  </section>
);

const FeatureHighlights = () => (
  <section className="features">
    <h2>Features</h2>
    <div className="feature-list">
      <div className="feature">
        <i className="icon">💰</i>
        <h3>Track Expenses</h3>
        <p>Monitor your spending and stay on top of your finances.</p>
      </div>
      <div className="feature">
        <i className="icon">📊</i>
        <h3>Visual Reports</h3>
        <p>Get detailed reports and insights into your financial habits.</p>
      </div>
      <div className="feature">
        <i className="icon">🔒</i>
        <h3>Secure</h3>
        <p>Your data is safe with our top-notch security measures.</p>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="how-it-works">
    <h2>How It Works</h2>
    <div className="steps">
      <div className="step">
        <h3>1. Sign Up</h3>
        <p>Create an account to get started.</p>
      </div>
      <div className="step">
        <h3>2. Add Accounts</h3>
        <p>Create accounts, expenses and incomes .</p>
      </div>
      <div className="step">
        <h3>3. Manage Budget</h3>
        <p>Set up your budget and start managing your expenses.</p>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="testimonials">
    <h2>What Our Users Say</h2>
    <div className="testimonial-list">
      <div className="testimonial">
        <p>"Budget Manager has transformed how I handle my money!"</p>
        <p>- Alex </p>
      </div>
      <div className="testimonial">
        <p>"I love the detailed reports and insights. Highly recommend!"</p>
        <p>- James </p>
      </div>
    </div>
  </section>
);



export default Home;