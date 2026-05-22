import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <div className="home_container">
      <nav className="home_nav">
        <div className="home_logo">GrubGo</div>
        <div className="home_auth_group">
          <Link href="/register" className="home_register_btn">Register</Link>
          <Link href="/login">
            <button className="home_login_btn">Login</button>
          </Link>
        </div>
      </nav>

      <section className="home_hero">
        <div className="home_hero_content">
          <p className="home_badge">Food Delivery Made Easy</p>
          <h1 className="home_title">
            Your Favorite Food,<br />
            Delivered <span>Fast</span>
          </h1>
          <p className="home_description">
            GrubGo connects you with the best restaurants and delivery partners
            to bring delicious meals right to your doorstep.
          </p>

          
        </div>

        <div className="home_hero_image">
          <div className="home_red_circle">
            <img
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2Zvdnh3cG0wZ2xkaGJmbW0wbDR1cHk0cThnZDNiYTlrY3k1cWNwayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fh2lOwknIOuDZbtWDH/giphy.gif"
              alt="GrubGo Rider"
              className="home_rider_img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}