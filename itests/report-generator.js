const report = require('multiple-cucumber-html-reporter');
report.generate({
    reportName: 'TestCafe Report',
    jsonDir: 'itests/results/report',
    reportPath: 'itests/results/html-reports',
    openReportInBrowser: true,
    disableLog: true,
    displayDuration: true,
    durationInMS: true,
    customData: {
        title: 'Run info',
        data: [
            { label: 'Project', value: `BigCommerce - Storefront` },
        ],
    },
});
