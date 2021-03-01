## `tango340b/codepipeline-webhook-action` Github Action

This github action allows user to trigger deployment for artifact using AWS Codepipeline.

### Usage

```

jobs:
    my_job:
        ...
        steps:
            - uses: tango340b/codepipeline-webhook-action@master
              with:
                  codepipeline_webhook_url: ${{ secrets.CODEPIPELINE_WEBHOOK_URL }}
                  codepipeline_webhook_secret: ${{ secrets.DEPLOYMENT_API_KEY }}
                  account_id: ${{ secrets.AWS_ACCOUNT_ID }}
                  codepipeline_name: <Codepipeline name>
            - ... other steps
```

**Note**: `codepipeline_webhook_url`, `codepipeline_webhook_secret`, `account_id` and `codepipeline_name` are required fields.