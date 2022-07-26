import { PainRecordDaily, PainRecordMonthly } from '../types';

export interface TotalPain {
    noPain: number;
    softPain: number;
    mediumPain: number;
    hardPain: number;
}

const getTotalDailyByValue = (
    value: number,
    painRecord: Array<PainRecordDaily>
) =>
    painRecord.filter((e) => e.score_pain !== null && +e.score_pain === value)
        .length;

const getTotalDailyPain = (painRecord: Array<PainRecordDaily>): TotalPain => {
    const noPain = getTotalDailyByValue(0, painRecord);
    const softPain = getTotalDailyByValue(1, painRecord);
    const mediumPain = getTotalDailyByValue(2, painRecord);
    const hardPain = getTotalDailyByValue(3, painRecord);
    return {
        noPain,
        softPain,
        mediumPain,
        hardPain,
    };
};

const getTotalMonthlyByKey = (
    key: keyof PainRecordMonthly['score_pain'],
    painRecord: Array<PainRecordMonthly>
): number => painRecord.reduce((sum, e) => e.score_pain[key] + sum, 0);

const getTotalMonthlyPain = (
    painRecord: Array<PainRecordMonthly>
): TotalPain => {
    const noPain = getTotalMonthlyByKey('score_0', painRecord);
    const softPain = getTotalMonthlyByKey('score_1', painRecord);
    const mediumPain = getTotalMonthlyByKey('score_2', painRecord);
    const hardPain = getTotalMonthlyByKey('score_3', painRecord);
    return {
        noPain,
        softPain,
        mediumPain,
        hardPain,
    };
};

export const getTotalPain = (
    key: 'daily' | 'monthly',
    painRecord: Array<PainRecordDaily> | Array<PainRecordMonthly>
): TotalPain => {
    if (key === 'daily') {
        return getTotalDailyPain(painRecord as Array<PainRecordDaily>);
    } else {
        return getTotalMonthlyPain(painRecord as Array<PainRecordMonthly>);
    }
};

export default getTotalPain;
