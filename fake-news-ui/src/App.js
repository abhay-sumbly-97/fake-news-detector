import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/check-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch result');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ai_result: 'Error', confidence: 0, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6 text-gray-800">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600">📰 Fake News Detector</h1>
        <p className="mt-2 text-gray-600">Check whether a news article or claim is real or fake using AI + Google Fact Check</p>
      </header>

      <main className="max-w-3xl mx-auto space-y-6 bg-white shadow-lg rounded-xl p-6">
        <textarea
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Paste a news article, headline, or claim..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className={`w-full text-white font-semibold py-3 rounded-lg transition duration-200 ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Checking...' : '🔍 Check News'}
        </button>

        {result && (
          <div
            className={`p-6 rounded-lg border-2 transition-all duration-300 ${
              result.ai_result === 'Fake'
                ? 'border-red-500 bg-red-50 text-red-700'
                : result.ai_result === 'Real'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-yellow-500 bg-yellow-50 text-yellow-700'
            }`}
          >
            <p className="text-xl font-bold">
              🧠 Prediction: {result.ai_result}
            </p>
            <p className="mt-2 font-medium">
              📊 Confidence: {result.confidence}%
            </p>

            {result.fact_check && typeof result.fact_check === 'object' ? (
              <div className="mt-4 text-sm bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">🧾 Google Fact Check Result</h4>
                <p><strong>Claim:</strong> {result.fact_check.text}</p>
                <p><strong>Rating:</strong> {result.fact_check.rating}</p>
                <p><strong>Claimant:</strong> {result.fact_check.claimant}</p>
                <p><strong>Publisher:</strong> {result.fact_check.publisher}</p>
              </div>
            ) : result.fact_check === 'No fact-check found' ? (
              <p className="mt-3 italic text-sm text-gray-600">⚠️ No related fact-check found from Google.</p>
            ) : null}

            {result.error && (
              <p className="mt-3 text-red-600 font-semibold">❌ Error: {result.error}</p>
            )}
          </div>
        )}
      </main>

      <footer className="mt-10 text-center text-sm text-gray-500">
        Built with 💙 using React, FastAPI & TailwindCSS
      </footer>
    </div>
  );
}

export default App;
