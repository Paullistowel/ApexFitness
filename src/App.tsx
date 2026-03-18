function App() {
  return (
    <div className="font-sans">
      {/* ====== Hero Section ====== */}
      <header className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
          ApexFitness
        </h1>
        <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-xl">
          Your ultimate fitness companion. Track workouts, set goals, and achieve your dream body!
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-200 transition-all duration-300">
            Get Started
          </button>
          <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-purple-600 transition-all duration-300">
            Learn More
          </button>
        </div>
      </header>

      {/* ====== Features Section ====== */}
      <section className="py-20 bg-gray-50 text-gray-800 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transform transition">
            <h3 className="text-2xl font-semibold mb-2">Workout Tracking</h3>
            <p>Log your exercises and monitor your progress with ease.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transform transition">
            <h3 className="text-2xl font-semibold mb-2">Nutrition Planner</h3>
            <p>Create meal plans, track calories, and stay on top of your diet.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transform transition">
            <h3 className="text-2xl font-semibold mb-2">Goal Setting</h3>
            <p>Set fitness goals and receive actionable tips to achieve them.</p>
          </div>
        </div>
      </section>

      {/* ====== CTA Section ====== */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center px-6">
        <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Life?</h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          Join thousands of fitness enthusiasts using ApexFitness to reach their goals faster.
        </p>
        <button className="bg-white text-purple-600 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-purple-200 transition-all duration-300 text-lg">
          Start Your Free Trial
        </button>
      </section>

      {/* ====== Footer ====== */}
      <footer className="py-6 bg-gray-800 text-gray-200 text-center">
        <p>© 2026 ApexFitness. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;