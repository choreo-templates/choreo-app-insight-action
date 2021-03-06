const AppInsights = require("applicationinsights");
const core = require("@actions/core");

try {
    const appInsightKey = core.getInput("appInsightKey");
    const vscodeChoreoUserEmail = core.getInput("vscodeChoreoUserEmail")
    const vscodeChoreoUserIdpId = core.getInput("vscodeChoreoUserIdpId")

    if (!appInsightKey) {
        console.log("App Insights Key has not been set. Skipping App Insights setup.");
        throw new Error("App Insights Key has not been set. Skipping App Insights setup.");
    }

    if (!vscodeChoreoUserEmail) {
        console.log("VSCode Choreo User Email has not been set. Skipping App Insights setup.");
        throw new Error("VSCode Choreo User Email has not been set. Skipping App Insights setup.");
    }

    if (!vscodeChoreoUserIdpId) {
        console.log("VSCode Choreo User Idp Id has not been set. Skipping App Insights setup.");
        throw new Error("VSCode Choreo User Idp Id has not been set. Skipping App Insights setup.");
    }

    AppInsights.setup(appInsightKey)
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

    const isWSO2User = vscodeChoreoUserEmail
        ? vscodeChoreoUserEmail.endsWith("@wso2.com")
        : false;

    const eventObject = {
        name: "wso2.ballerina/editor-workspace-git-push",
        properties: {
            scope: "git-push",
            idpId: vscodeChoreoUserIdpId
                ? vscodeChoreoUserIdpId
                : "",
            isWSO2User: isWSO2User ? "true" : "false",
        },
    };
    AppInsightsClient.trackEvent(eventObject);
    console.log("Event tracked");
} catch (e) {
    core.setOutput("choreo-app-insight-status", "failed");
    core.setFailed(e.message);
    console.log("choreo-app-insight-status", "failed");
    console.log(e.message);
}

