import { useState } from "react";
import "../styles/LoginPage.css";

function LoginPage({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            alert("Please fill in all fields");
            return;
        }

        onLogin();
    };
    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-brand-panel">
                    <span className="login-badge">FocusFlow</span>
                    <h1>Welcome back</h1>
                    <p>
                        Sign in to continue managing your tasks, notes, goals, and
                        productivity in one smart workspace.
                    </p>

                    <div className="login-brand-card">
                        <h3>Your productivity, one place</h3>
                        <p>
                            Stay organized, track your goals, and keep your focus with a clean
                            professional dashboard.
                        </p>
                    </div>
                </div>

                <div className="login-form-panel">
                    <div className="login-card">
                        <div className="login-card-header">
                            <h2>Sign In</h2>
                            <p>Enter your account details to access FocusFlow.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="password-field">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="login-btn">
                                Sign In
                            </button>
                        </form>

                        <div className="login-footer-text">
                            <p>Secure access for your FocusFlow workspace.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;