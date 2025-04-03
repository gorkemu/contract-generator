import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Contract Generator</Link>
      <div className={styles.links}>
        <Link to="/">Sözleşmeler</Link>
      </div>
    </nav>
  );
}