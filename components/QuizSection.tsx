import React, { useState } from 'react';
import quizData from '@/data/quiz.json';
import { Trophy, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizSectionProps {
  language: "id" | "en" | "ar";
}

export default function QuizSection({ language }: QuizSectionProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState<number>(0);

  React.useEffect(() => {
    const saved = localStorage.getItem('sirah_quiz_best');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const isArabic = language === "ar";
  const question = quizData[currentQIndex];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === question.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < quizData.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('sirah_quiz_best', score.toString());
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center px-4 py-16 sm:px-8 max-w-2xl mx-auto" dir={isArabic ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.7 }}
        className="bg-deep-obsidian/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-sand-gold/30 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-desert-umber to-sand-gold" />
        
        {!isFinished ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isArabic ? 20 : -20 }}
            >
              <div className="flex items-center gap-3 text-sand-gold mb-6 uppercase tracking-widest font-bold text-sm">
                <Trophy className="w-5 h-5" />
                {isArabic ? "اختبار السيرة" : (language === "en" ? "Sirah Quiz" : "Kuis Sirah")} 
                <span className="text-gray-500 ml-auto mr-auto">{currentQIndex + 1} / {quizData.length}</span>
              </div>
              
              <h3 className={`text-2xl md:text-3xl font-bold mb-8 leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>
                {question.question[language]}
              </h3>

              <div className="space-y-4">
                {question.options[language].map((opt, idx) => {
                  let btnStateClass = "bg-white/5 hover:bg-white/10 border-white/10";
                  if (isAnswered) {
                    if (idx === question.correctIndex) {
                      btnStateClass = "bg-emerald-prophetic/20 border-emerald-prophetic text-emerald-100";
                    } else if (idx === selectedAnswer) {
                      btnStateClass = "bg-red-500/20 border-red-500 text-red-100";
                    } else {
                      btnStateClass = "bg-white/5 border-white/5 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${btnStateClass} ${isArabic ? 'text-right font-arabic text-lg' : ''}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isAnswered && idx === selectedAnswer && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="mt-8 w-full py-3 bg-sand-gold hover:bg-desert-umber text-white rounded-xl font-bold shadow-lg transition-colors"
                >
                  {isArabic ? "التالي" : (language === "en" ? "Next Question" : "Pertanyaan Selanjutnya")}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <Trophy className="w-20 h-20 text-sand-gold mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">{isArabic ? "اكتمل الاختبار!" : (language === "en" ? "Quiz Completed!" : "Kuis Selesai!")}</h2>
            <p className="text-xl text-gray-300 mb-2">
              {isArabic ? "نتيجتك:" : (language === "en" ? "Your Score:" : "Skor Anda:")} <strong className="text-sand-gold text-3xl">{score} / {quizData.length}</strong>
            </p>
            {bestScore > 0 && (
              <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest font-bold">
                {isArabic ? "أعلى نتيجة:" : (language === "en" ? "Best Score:" : "Skor Tertinggi:")} {Math.max(score, bestScore)}
              </p>
            )}
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              {isArabic ? "حاول مرة أخرى" : (language === "en" ? "Try Again" : "Coba Lagi")}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
