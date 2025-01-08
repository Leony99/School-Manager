// IT APPEARS THAT BIG CALENDAR SHOWS THE LAST WEEK WHEN THE CURRENT DAY IS A WEEKEND.
// FOR THIS REASON WE'LL GET THE LAST WEEK AS THE REFERENCE WEEK.

const getLatestMonday = (): Date => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const latestMonday = today;
    latestMonday.setDate(today.getDate() - daysSinceMonday);
    return latestMonday;
};

export const adjustScheduleToCurrentWeek = (
    exams: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
    const latestMonday = getLatestMonday();

    return exams.map((exam) => {
        const examDayOfWeek = exam.start.getDay();

        const daysFromMonday = examDayOfWeek === 0 ? 6 : examDayOfWeek - 1;

        const adjustedStartDate = new Date(latestMonday);

        adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
        adjustedStartDate.setHours(
            exam.start.getHours(),
            exam.start.getMinutes(),
            exam.start.getSeconds()
        );
        const adjustedEndDate = new Date(adjustedStartDate);
        adjustedEndDate.setHours(
            exam.end.getHours(),
            exam.end.getMinutes(),
            exam.end.getSeconds()
        );

        return {
            title: exam.title,
            start: adjustedStartDate,
            end: adjustedEndDate,
        };
    });
};