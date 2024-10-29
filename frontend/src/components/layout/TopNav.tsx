import './TopNav.css';
import BHASLogoWords from '@assets/BHAS-LogoWords.png';

const TopNav = () => {
  return (
    <nav className="top-nav">
      <div className="logo-container">
        <img src={BHASLogoWords} alt="LogoWords" className="navbar-logo" />
      </div>
    </nav>
  );
};

export default TopNav;
