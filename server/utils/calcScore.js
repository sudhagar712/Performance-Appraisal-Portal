export const calcFinalScore = (items, mode = "self") => {
  let total = 0;

  for (const item of items) {
    const weight = Number(item.weightage || 0);

    const ratings = item.kpis
      .map((kpi) => (mode === "self" ? kpi.selfRating : kpi.managerRating))
      .filter((r) => typeof r === "number");

    const avg = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    total += (weight * avg) / 5;
  }

  return Number(total.toFixed(2));
};
