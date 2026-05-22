'use client';

import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect back to the login page
    router.push('/');
  };

  return (
    <div style={styles.container}>
      <main style={styles.card}>
        <h1 style={styles.heading}>🎉 Welcome to the Customer Area!</h1>
        <p style={styles.text}>This is a placeholder page for testing your protected routes and navigation.</p>
        
        <button onClick={handleLogout} style={styles.button}>
          Log Out
        </button>
      </main>
    </div>
  );
}

// Simple inline styles so you don't need a separate CSS file for testing
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf5', // Matches your login cream background
    fontFamily: 'sans-serif',
    padding: '1rem',
  },
  card: {
    background: 'white',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    textAlign: 'center' as const,
    maxWidth: '400px',
  },
  heading: {
    color: '#1a1a1a',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  text: {
    color: '#71717a',
    fontSize: '0.95rem',
    marginBottom: '2rem',
    lineHeight: '1.5',
  },
  button: {
    backgroundColor: '#c2210a', // Matches your brand red
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  }
};