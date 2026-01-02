import { useState } from "react";
import { motion } from "framer-motion";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to vault projects page
        const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/vault/projects";
        window.location.href = redirectUrl;
      } else {
        const data = await response.json();
        setError(data.message || "Invalid password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <div className="password-form__field">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="password-form__input"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>

      {error && (
        <motion.p
          className="password-form__error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        className="password-form__submit"
        disabled={isLoading || !password}
      >
        {isLoading ? (
          <span className="password-form__loading">
            <svg className="password-form__spinner" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray="31.4"
                strokeLinecap="round"
              />
            </svg>
            Verifying...
          </span>
        ) : (
          "Enter Vault"
        )}
      </button>

      <style>{`
        .password-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .password-form__field {
          position: relative;
        }

        .password-form__input {
          width: 100%;
          padding: 1rem 1.25rem;
          font-family: var(--font-sans);
          font-size: 1rem;
          color: var(--color-text);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(242, 111, 37, 0.25);
          border-radius: 0.75rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .password-form__input::placeholder {
          color: var(--color-text-muted);
        }

        .password-form__input:focus {
          border-color: var(--color-ember);
          box-shadow: 0 0 0 3px rgba(242, 111, 37, 0.15);
        }

        .password-form__input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-form__error {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: #ef4444;
          text-align: center;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 0.5rem;
        }

        .password-form__submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-night);
          background: linear-gradient(135deg, rgba(181, 48, 28, 0.95), rgba(255, 98, 0, 0.85));
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
        }

        .password-form__submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(242, 111, 37, 0.4);
        }

        .password-form__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-form__loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .password-form__spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </form>
  );
}
