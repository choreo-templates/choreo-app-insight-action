const AppInsights = require("applicationinsights");

const key = "e7703a9d-bb5c-4e3a-b4e3-05c773fd87d1";

AppInsights.setup(key)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(AppInsights.DistributedTracingModes.AI)
    .start();

const AppInsightsClient = AppInsights.defaultClient;

const isWSO2User = process.env.VSCODE_CHOREO_USER_EMAIL
    ? process.env.VSCODE_CHOREO_USER_EMAIL.endsWith("@wso2.com")
    : false;

const eventObject = {
    name: "editor-workspace-git-push",
    properties: {
        scope: "git-push",
        idpId: process.env.VSCODE_CHOREO_USER_IDP_ID
            ? process.env.VSCODE_CHOREO_USER_IDP_ID
            : "",
        isWSO2User: isWSO2User ? "true" : "false",
    },
};
AppInsightsClient.trackEvent(eventObject);
