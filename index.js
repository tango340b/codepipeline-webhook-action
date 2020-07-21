const core = require('@actions/core');
const github = require('@actions/github');

try {
  const name = core.getInput('name');
  const region = core.getInput('region') || "us-east-1";
  const awsAccountId = core.getInput('aws_account_id');
  const codepipelineWebhookSecret = core.getInput('codepipeline_webhook_secret');
  const codepipelineWebhookUrl = core.getInput('codepipeline_webhook_url')

  const repoName=process.env.GITHUB_REPOSITORY.split("/")[1]
  const branchName = process.env.GITHUB_REF.split("/")[2]

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache',
      credentials: 'same-origin', 
      headers: {
        'x-api-key' : codepipelineWebhookSecret
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }


  const body = {
    "APG": {
      "appName": repoName,
      "branchName": branchName,
      "buildRevision": process.env.GITHUB_RUN_NUMBER,
      "codePipeline": {
        "name": name,
        "region": region,
        "accountID": awsAccountId
      }
    }
  }
  postData(codepipelineWebhookUrl, body)
    .then(data => {
      console.log(data);
    });

} catch (error) {
  core.setFailed(error.message);
}

