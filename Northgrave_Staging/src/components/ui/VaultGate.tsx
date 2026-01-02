import { useState } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  poster: string;
  year: string;
  genre: string;
  status: string;
  logline: string;
  isVaulted: boolean;
}

interface VaultGateProps {
  projects: Project[];
}

export default function VaultGate({ projects }: VaultGateProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "slate") {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(false);
  };

  if (!isUnlocked) {
    return (
      <div className="vault-gate">
        <div className="vault-gate__container">
          <h1 className="vault-gate__title">The Vault</h1>
          <p className="vault-gate__subtitle">Enter password to access exclusive content</p>

          <form onSubmit={handleSubmit} className="vault-gate__form">
            <input
              type="password"
              className={`vault-gate__input ${error ? "vault-gate__input--error" : ""}`}
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              autoFocus
            />
            {error && <p className="vault-gate__error">Incorrect password</p>}
            <button type="submit" className="vault-gate__submit">
              Unlock
            </button>
          </form>
        </div>

        <style>{`
          .vault-gate {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: linear-gradient(180deg, rgba(5, 5, 9, 1), rgba(2, 1, 5, 1));
          }

          .vault-gate__container {
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .vault-gate__title {
            font-family: var(--font-display);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 600;
            letter-spacing: 0.15em;
            color: var(--color-text-gold);
            text-transform: uppercase;
            margin-bottom: 1rem;
          }

          .vault-gate__subtitle {
            font-family: var(--font-body);
            font-size: 1rem;
            color: var(--color-text-muted);
            margin-bottom: 2.5rem;
          }

          .vault-gate__form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .vault-gate__input {
            width: 100%;
            padding: 1rem 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(196, 69, 54, 0.3);
            border-radius: 0.5rem;
            color: #fff;
            font-family: var(--font-sans);
            font-size: 1rem;
            text-align: center;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .vault-gate__input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          .vault-gate__input:focus {
            border-color: var(--color-ember);
            box-shadow: 0 0 20px rgba(196, 69, 54, 0.3);
          }

          .vault-gate__input--error {
            border-color: #ff4444;
          }

          .vault-gate__error {
            font-family: var(--font-body);
            font-size: 0.85rem;
            color: #ff6b6b;
          }

          .vault-gate__submit {
            padding: 1rem 3rem;
            background: linear-gradient(135deg, var(--color-ember-dark), var(--color-ember));
            color: #fff;
            font-family: var(--font-sans);
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            border: none;
            border-radius: 999px;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .vault-gate__submit:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(196, 69, 54, 0.5);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="vault">
      <div className="vault__header">
        <h1 className="vault__title">The Vault</h1>
        <p className="vault__subtitle">Exclusive access to our project packages</p>
      </div>

      <div className="vault__grid">
        {projects.map((project) => (
          <div key={project.id} className="vault__card">
            <div className="vault__poster-container">
              <img
                src={project.poster}
                alt={`${project.title} poster`}
                className="vault__poster"
              />
            </div>
            <div className="vault__info">
              <h2 className="vault__card-title">{project.title}</h2>
              <a
                href="https://jetx.storydoc.com/91t8BC"
                className="vault__cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click for Deck
              </a>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .vault {
          min-height: 100vh;
          padding: 8rem 2rem 4rem;
          background: linear-gradient(180deg, rgba(5, 5, 9, 1), rgba(2, 1, 5, 1));
        }

        .vault__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .vault__title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--color-text-gold);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .vault__subtitle {
          font-family: var(--font-body);
          font-size: 1.1rem;
          color: var(--color-text-muted);
        }

        .vault__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
          justify-items: center;
        }

        .vault__card {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .vault__poster-container {
          aspect-ratio: 2/3;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(196, 69, 54, 0.2);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .vault__card:hover .vault__poster-container {
          border-color: rgba(196, 69, 54, 0.5);
          box-shadow: 0 0 30px rgba(196, 69, 54, 0.2);
        }

        .vault__poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vault__info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .vault__card-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--color-text-gold);
          text-transform: uppercase;
          text-align: center;
        }

        .vault__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.75rem;
          background: linear-gradient(135deg, var(--color-ember-dark), var(--color-ember));
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 999px;
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        .vault__cta:hover {
          transform: scale(1.05);
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(196, 69, 54, 0.4);
          }
          50% {
            box-shadow: 0 0 35px rgba(196, 69, 54, 0.8), 0 0 50px rgba(232, 93, 76, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
