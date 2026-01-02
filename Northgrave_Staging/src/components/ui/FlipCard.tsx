import { useState, useEffect } from "react";

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

interface FlipCardProps {
  project: Project;
}

export default function FlipCard({ project }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if master password was previously entered
  useEffect(() => {
    if (typeof window !== "undefined") {
      const masterUnlocked = localStorage.getItem("northgrave_master_unlocked");
      if (masterUnlocked === "true") {
        setIsUnlocked(true);
        setShowPasswordInput(true);
      }
    }
  }, []);


  const handleAccessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPasswordInput(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // Individual password unlocks this card
    if (value === "password") {
      setIsUnlocked(true);
    }
    // Master password unlocks all cards
    if (value === "slate") {
      setIsUnlocked(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("northgrave_master_unlocked", "true");
        // Dispatch event to notify other cards
        window.dispatchEvent(new CustomEvent("masterUnlocked"));
      }
    }
  };

  // Listen for master unlock from other cards
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMasterUnlock = () => {
        setIsUnlocked(true);
        setShowPasswordInput(true);
      };
      window.addEventListener("masterUnlocked", handleMasterUnlock);
      return () => window.removeEventListener("masterUnlocked", handleMasterUnlock);
    }
  }, []);

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flip-card"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => {
        // Only stay flipped if user is actively entering password (not yet unlocked)
        const isEnteringPassword = showPasswordInput && !isUnlocked;
        if (!isEnteringPassword) {
          setIsFlipped(false);
        }
      }}
      onFocus={() => setIsFlipped(true)}
      onBlur={() => setIsFlipped(false)}
      tabIndex={0}
      role="article"
      aria-label={`${project.title} project card`}
    >
      <div
        className={`flip-card__inner ${isFlipped ? "flip-card__inner--flipped" : ""}`}
      >
        {/* Front - Poster */}
        <div className="flip-card__front">
          <img
            src={project.poster}
            alt={`${project.title} poster`}
            className="flip-card__poster"
          />
          <div className="flip-card__hover-overlay">
            <span className="flip-card__hover-hint">(Hover for more)</span>
          </div>
        </div>

        {/* Back - Logline and CTA */}
        <div className="flip-card__back">
          <div className="flip-card__content">
            <h3 className="flip-card__title">{project.title}</h3>
            <p className="flip-card__logline">{project.logline}</p>

            {!showPasswordInput ? (
              <button
                className="flip-card__cta"
                onClick={handleAccessClick}
              >
                Access Package
              </button>
            ) : isUnlocked ? (
              <a
                href="https://jetx.storydoc.com/91t8BC"
                className="flip-card__deck-btn"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Click for Deck
              </a>
            ) : (
              <div className="flip-card__password-container">
                <input
                  type="password"
                  className="flip-card__password-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handlePasswordKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .flip-card {
          position: relative;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 2/3;
          perspective: 1000px;
          cursor: pointer;
        }

        .flip-card:focus {
          outline: 2px solid var(--color-ember);
          outline-offset: 4px;
          border-radius: 1rem;
        }

        .flip-card__inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flip-card__inner--flipped {
          transform: rotateY(180deg);
        }

        .flip-card__front,
        .flip-card__back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1rem;
          overflow: hidden;
        }

        .flip-card__front {
          background: linear-gradient(145deg, rgba(20, 15, 25, 0.8), rgba(10, 8, 12, 0.9));
        }

        .flip-card__poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .flip-card__hover-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.4rem 0.8rem;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 0.5rem;
          pointer-events: none;
        }

        .flip-card__hover-hint {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          white-space: nowrap;
        }

        .flip-card__back {
          transform: rotateY(180deg);
          background: linear-gradient(145deg, rgba(15, 12, 20, 0.98), rgba(8, 5, 12, 0.99));
          border: 1px solid rgba(196, 69, 54, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .flip-card__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .flip-card__title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--color-text-gold);
          text-transform: uppercase;
        }

        .flip-card__logline {
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-text);
          opacity: 0.9;
        }

        .flip-card__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, var(--color-ember-dark), var(--color-ember));
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          border-radius: 999px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .flip-card__cta:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(196, 69, 54, 0.5);
        }

        .flip-card__password-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .flip-card__password-input {
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(196, 69, 54, 0.5);
          border-radius: 999px;
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          text-align: center;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .flip-card__password-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .flip-card__password-input:focus {
          border-color: var(--color-ember);
          box-shadow: 0 0 15px rgba(196, 69, 54, 0.3);
        }

        .flip-card__deck-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, var(--color-ember-dark), var(--color-ember));
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 999px;
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        .flip-card__deck-btn:hover {
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
