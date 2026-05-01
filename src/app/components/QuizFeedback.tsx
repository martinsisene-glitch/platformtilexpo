interface QuizFeedbackProps {
  isCorrect: boolean;
  onContinue: () => void;
}

export function QuizFeedback({ isCorrect, onContinue }: QuizFeedbackProps) {
  const sustainabilityFacts = [
    "Brabrand Lake is home to over 200 species of birds, making it an important ecosystem for biodiversity.",
    "Walking instead of driving reduces CO2 emissions by approximately 0.9 kg per kilometer.",
    "Denmark aims to reduce greenhouse gas emissions by 70% by 2030 compared to 1990 levels.",
    "Urban green spaces like Brabrand Lake help filter air pollution and reduce city temperatures.",
    "Native plants around the lake require less water and provide better habitats for local wildlife."
  ];

  const randomFact = sustainabilityFacts[Math.floor(Math.random() * sustainabilityFacts.length)];

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-8">
      <div className="max-w-2xl w-full space-y-8">
        {isCorrect ? (
          <>
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🎉</div>
              <h1 className="text-5xl border-b-8 border-black pb-4 mb-4">CONGRATS!</h1>
              <p className="text-3xl">YOU ANSWERED CORRECTLY</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🌱</div>
              <h1 className="text-4xl border-b-8 border-black pb-4 mb-4">SORRY</h1>
              <p className="text-2xl mb-8">NOT COMPLETELY RIGHT</p>
            </div>

            <div className="bg-lime-100 border-4 border-black p-6 mb-8">
              <h2 className="text-2xl mb-4 border-b-4 border-black pb-2">SUSTAINABILITY FACT</h2>
              <p className="text-xl">{randomFact}</p>
            </div>
          </>
        )}

        <button
          onClick={onContinue}
          className="w-full bg-lime-400 border-4 border-black rounded-full py-6 text-3xl hover:bg-lime-500 transition-colors"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
