const core = require('@actions/core');
const fetch = require('node-fetch');

try {
  const codepipelineWebhookSecret = core.getInput('codepipeline_webhook_secret');
  const codepipelineWebhookUrl = core.getInput('codepipeline_webhook_url')
  const accountId = core.getInput('account_id');
  const pipelineName = core.getInput('codepipeline_name');

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
    appName: repoName,
    branchName: branchName,
    buildRevision: process.env.GITHUB_RUN_NUMBER,
    codePipeline: {
      name: pipelineName,
      region: 'us-east-1',
      accountId
    }
  }
  postData(codepipelineWebhookUrl, body)
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));

} catch (error) {
  core.setFailed(error.message);
}

