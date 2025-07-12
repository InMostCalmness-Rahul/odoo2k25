const Home = () => {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to SkillSwap</h1>
        <p className="text-lg text-gray-600 mb-6">Connect and exchange skills with others.</p>
        <div className="flex justify-center gap-4">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Browse Skills</button>
        </div>
      </section>
      {/* Add more content or features here as needed */}
    </main>
  );
};

export default Home;
