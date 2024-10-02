import s from './page.module.scss'

export default function Home() {
  return (
    <div className={s.main}>
      <h1>Welcome to the Home Page!</h1>
      <p>This is your main content area.</p>
      {/* Add more content as needed */}
    </div>
  );
}
