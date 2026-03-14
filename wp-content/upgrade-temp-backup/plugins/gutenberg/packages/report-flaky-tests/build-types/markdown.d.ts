import type { MetaData, FlakyTestResult, ReportedIssue } from './types';
type ParsedTestResult = {
    date: Date;
    failedTimes: number;
    runURL: string;
    headBranch: string;
    errorMessage?: string;
};
declare function renderIssueBody({ meta, testTitle, testPath, formattedTestResults, }: {
    meta: MetaData;
    testTitle: string;
    testPath: string;
    formattedTestResults: string;
}): string;
declare function formatTestErrorMessage(flakyTestResult: FlakyTestResult): string;
declare function formatTestResults({ date, failedTimes, headBranch, runURL, errorMessage, }: ParsedTestResult): string;
declare function parseFormattedTestResults(formattedTestResults: string): ParsedTestResult;
declare function parseIssueBody(body: string): {
    meta: MetaData;
    testResults: ParsedTestResult[];
};
declare function renderCommitComment({ reportedIssues, runURL, commitSHA, }: {
    reportedIssues: ReportedIssue[];
    runURL: string;
    commitSHA: string;
}): string;
declare function isReportComment(body: string): boolean;
export { renderIssueBody, formatTestErrorMessage, formatTestResults, parseFormattedTestResults, parseIssueBody, renderCommitComment, isReportComment, };
//# sourceMappingURL=markdown.d.ts.map