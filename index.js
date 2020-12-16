const core = require('@actions/core');
const fetch = require('node-fetch');

try {
  const env = core.getInput("deployment_environment")
  const codepipelineWebhookSecret = core.getInput('codepipeline_webhook_secret');
  const codepipelineWebhookUrl = core.getInput('codepipeline_webhook_url')

  const repoName = process.env.GITHUB_REPOSITORY.split("/")[1]
  // refs/heads/feature/foo/bar -> feature-foo-bar
  const branchName = process.env.GITHUB_REF.split('/').slice(2).join('-')

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': codepipelineWebhookSecret
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }


  const body = {
    "environment": env,
    "appName": repoName,
    "branchName": branchName,
    "buildRevision": process.env.GITHUB_RUN_NUMBER
  }
  postData(codepipelineWebhookUrl, body)
    .then(data => {
      console.log(data);
    });

} catch (error) {
  core.setFailed(error.message);
}

