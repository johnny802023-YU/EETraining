import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { quizzes } from "../data/trainingData.js";

const quizCategories = ["全部", "元件", "電路", "通訊", "FA Debug", "車用系統"];

function getQuestionSeed(questionId) {
  return String(questionId)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getDisplayOptions(question) {
  const options = question.options.map((label, originalIndex) => ({ label, originalIndex }));
  const offset = (getQuestionSeed(question.id) % (options.length - 1)) + 1;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

export default function QuizPage() {
  const { trainingRecords } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState("全部");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [scoreByQuestion, setScoreByQuestion] = useState({});

  const questions = useMemo(() => {
    return activeCategory === "全部"
      ? quizzes
      : quizzes.filter((question) => question.category === activeCategory);
  }, [activeCategory]);

  const currentQuestion = questions[currentIndex] ?? questions[0];
  const displayOptions = useMemo(() => getDisplayOptions(currentQuestion), [currentQuestion]);
  const correctDisplayIndex = displayOptions.findIndex((option) => option.originalIndex === currentQuestion.answer);
  const isCorrect = answered && selectedOption === correctDisplayIndex;
  const score = Object.values(scoreByQuestion).filter(Boolean).length;

  function resetQuestionState(nextIndex = 0) {
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setAnswered(false);
  }

  function handleCategoryChange(category) {
    setActiveCategory(category);
    resetQuestionState(0);
  }

  function handleAnswer(index) {
    if (answered) {
      return;
    }

    setSelectedOption(index);
    setAnswered(true);
    setScoreByQuestion((current) => ({
      ...current,
      [currentQuestion.id]: index === correctDisplayIndex,
    }));
    trainingRecords.recordQuizAnswer({
      questionId: currentQuestion.id,
      category: currentQuestion.category,
      question: currentQuestion.question,
      selectedOption: displayOptions[index].label,
      correctOption: displayOptions[correctDisplayIndex].label,
      isCorrect: index === correctDisplayIndex,
    });
  }

  function goToQuestion(direction) {
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), questions.length - 1);
    resetQuestionState(nextIndex);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Quiz"
        title="Quiz 測驗"
        description="單選題涵蓋元件、電路、通訊、FA Debug 與車用系統，作答後立即顯示結果與解析。"
        action={
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="font-semibold text-navy-900">{score}</span>
            <span className="text-slate-500"> / {quizzes.length} answered correct</span>
          </div>
        }
      />
      <CategoryFilter categories={quizCategories} activeCategory={activeCategory} onChange={handleCategoryChange} />

      <section className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-md border border-navy-100 bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-800">
              {currentQuestion.category}
            </span>
            <p className="text-sm text-slate-500">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>

          <h2 className="text-2xl font-semibold leading-9 text-navy-900">{currentQuestion.question}</h2>

          <div className="mt-6 grid gap-3">
            {displayOptions.map((option, index) => {
              const selected = selectedOption === index;
              const correctAnswer = answered && correctDisplayIndex === index;
              const wrongAnswer = answered && selected && correctDisplayIndex !== index;

              return (
                <button
                  key={`${option.originalIndex}-${option.label}`}
                  type="button"
                  onClick={() => handleAnswer(index)}
                  className={[
                    "focus-ring flex min-h-14 items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left text-sm font-medium transition",
                    correctAnswer
                      ? "border-teal-200 bg-teal-50 text-teal-800"
                      : wrongAnswer
                        ? "border-rose-200 bg-rose-50 text-rose-800"
                        : selected
                          ? "border-navy-300 bg-navy-50 text-navy-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-navy-200 hover:bg-navy-50",
                  ].join(" ")}
                  disabled={answered}
                >
                  <span>{option.label}</span>
                  {correctAnswer ? <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
                  {wrongAnswer ? <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          {answered ? (
            <div
              className={[
                "mt-6 rounded-lg border p-4",
                isCorrect ? "border-teal-200 bg-teal-50" : "border-rose-200 bg-rose-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 font-semibold">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-700" aria-hidden="true" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-700" aria-hidden="true" />
                )}
                <span className={isCorrect ? "text-teal-800" : "text-rose-800"}>
                  {isCorrect ? "答對" : "答錯"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{currentQuestion.explanation}</p>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goToQuestion(-1)}
              disabled={currentIndex === 0}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              上一題
            </button>
            <button
              type="button"
              onClick={() => goToQuestion(1)}
              disabled={currentIndex === questions.length - 1}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-40"
            >
              下一題
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-semibold text-navy-900">題目分類</h2>
          <div className="mt-4 grid gap-3">
            {quizCategories.slice(1).map((category) => {
              const total = quizzes.filter((quiz) => quiz.category === category).length;
              const correct = quizzes
                .filter((quiz) => quiz.category === category)
                .filter((quiz) => scoreByQuestion[quiz.id]).length;
              const percent = total ? Math.round((correct / total) * 100) : 0;

              return (
                <div key={category} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-slate-700">{category}</span>
                    <span className="text-slate-500">
                      {correct}/{total}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-signal-green" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
  );
}
