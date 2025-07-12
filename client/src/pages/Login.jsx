const Login = () => {
  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input type="email" id="email" className="input-field" placeholder="Enter your email" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input type="password" id="password" className="input-field" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-primary-600 hover:text-primary-700 ml-1">Sign up</a>
        </p>
      </section>
    </main>
  );
};

export default Login;
