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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch result');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ ai_result: 'Error', confidence: 0, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4">
      <header className="text-center py-6 border-b">
        <h1 className="text-3xl font-bold text-blue-600">🕵️‍♂️ Fake News Detector</h1>
        <p className="text-gray-500 mt-2">Paste news and check if it's real or fake</p>
      </header>

      <main className="max-w-2xl mx-auto mt-10 space-y-6">
        <textarea
          rows={6}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Paste news article or headline here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded transition duration-200"
        >
          {loading ? 'Checking...' : 'Check News'}
        </button>

        {result && (
          <div className={`text-center text-lg font-medium p-4 rounded shadow
            ${result.ai_result === 'Fake' ? 'bg-red-100 text-red-700' : result.ai_result === 'Real' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
          `}>
            <p>🔍 <strong>Prediction:</strong> {result.ai_result}</p>
            <p>📊 <strong>Confidence:</strong> {result.confidence}%</p>

            {result.fact_check && typeof result.fact_check === 'object' ? (
              <div className="mt-4 text-sm text-left border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">🧠 Google Fact Check Result</h3>
                <p><strong>Claim:</strong> {result.fact_check.text}</p>
                <p><strong>Rating:</strong> {result.fact_check.rating}</p>
                <p><strong>Claimant:</strong> {result.fact_check.claimant}</p>
                <p><strong>Publisher:</strong> {result.fact_check.publisher}</p>
              </div>
            ) : result.fact_check === 'No fact-check found' ? (
              <p className="mt-2 text-gray-500">⚠️ No fact-check found from Google.</p>
            ) : null}

            {result.error && (
              <p className="mt-2 text-red-600 font-semibold">❌ {result.error}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;