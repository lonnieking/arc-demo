# 🌩 Intro to Architect

---

### Architect
![brian](https://avatars1.githubusercontent.com/u/990?s=200&v=4)
- Created in mid-2017 by Brian LeRoux (co-founder/CTO of Begin and co-creator of PhoneGap)
- [arc.codes](https://arc.codes) | [arc-repos on github](https://github.com/arc-repos/)
- JSF maintains ownership to ensure ongoing open source and open governance

---

### Infrastructure as Code

- Manifest checked into your revision control system so you can version your infra beside your code
- Tooling for managing the manifest based infra (usually global CLI binary) 
- Some options are Terraform HCL, Serverless YAML, AWS SAM

---

### Serverless YAML

provisions a couple of lambdas and a dynamoDB table

```
# serverless.yml

service: users

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev # Set the default stage used. Default is dev
  region: us-east-1 # Overwrite the default region used. Default is us-east-1
  profile: production # The default profile to use with this service
  memorySize: 512 # Overwrite the default memory size. Default is 1024
  deploymentBucket:
    name: com.serverless.${self:provider.region}.deploys # Overwrite the default deployment bucket
    serverSideEncryption: AES256 # when using server-side encryption
  versionFunctions: false # Optional function versioning
  stackTags: # Optional CF stack tags
   key: value
  stackPolicy: # Optional CF stack policy. The example below allows updates to all resources except deleting/replacing EC2 instances (use with caution!)
    - Effect: Allow
      Principal: "*"
      Action: "Update:*"
      Resource: "*"
    - Effect: Deny
      Principal: "*"
      Action:
        - Update:Replace
        - Update:Delete
      Condition:
        StringEquals:
          ResourceType:
            - AWS::EC2::Instance

functions:
  usersCreate: # A Function
    handler: users.create
    events: # The Events that trigger this Function
      - http: post users/create
  usersDelete: # A Function
    handler: users.delete
    events:  # The Events that trigger this Function
      - http: delete users/delete

# The "Resources" your "Functions" use.  Raw AWS CloudFormation goes in here.
resources:
  Resources:
    usersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: usersTable
        AttributeDefinitions:
          - AttributeName: email
            AttributeType: S
        KeySchema:
          - AttributeName: email
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

---

### AWS SAM

provisions a couple of lambdas and a dynamoDB table

```
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Simple CRUD webservice. State is stored in a SimpleTable (DynamoDB) resource.
Resources:
GetFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.get
    Runtime: nodejs4.3
    CodeUri: s3:///api_backend.zip
    Policies: AmazonDynamoDBReadOnlyAccess
    Environment:
      Variables:
        TABLE_NAME: !Ref Table
    Events:
      GetResource:
        Type: Api
        Properties:
          Path: /resource/{resourceId}
          Method: get

PutFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.put
    Runtime: nodejs4.3
    CodeUri: s3:///api_backend.zip
    Policies: AmazonDynamoDBFullAccess
    Environment:
      Variables:
        TABLE_NAME: !Ref Table
    Events:
      PutResource:
        Type: Api
        Properties:
          Path: /resource/{resourceId}
          Method: put

DeleteFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.delete
    Runtime: nodejs4.3
    CodeUri: s3:///api_backend.zip
    Policies: AmazonDynamoDBFullAccess
    Environment:
      Variables:
        TABLE_NAME: !Ref Table
    Events:
      DeleteResource:
        Type: Api
        Properties:
          Path: /resource/{resourceId}
          Method: delete

Table:
  Type: AWS::Serverless::SimpleTable
```

---

### Terraform HCL Example

Provision one lambda function

```
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
      "Action": "sts:AssumeRole",
      "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Effect": "Allow",
    "Sid": ""
  }]
}
EOF
}

resource "aws_lambda_function" "test_lambda" {
  filename         = "lambda_function_payload.zip"
  function_name    = "lambda_function_name"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "exports.test"
  source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  runtime          = "nodejs4.3"
  environment {
    variables = {
      foo = "bar"
    }
  }
}
```

---

### Problems

- Deep proprietary knowledge is required to configure and maintain common infrastructure primatives
- Painful manifest files; JSON and YAML are not ideal
- Tooling was designed for the last generation of metaphors
- We are committing AWS infrastructure configuration junk into our revision control systems

---

Architecture as Text > Infrastructure as Code

Architect allows us to provision and deploy cloud infrastructure with a simple plaintext manifest

---

### .arc file
Provisions an application with one lambda...

```
@app
helloapp

@html
get /
```

---

### .arc file

- Plain text file
- Comments start with #
- Sections start with @
- Everything after a section becomes instructions for generating AWS infrastructure

---

### npm run create
generates the structure...

```
#   /
#   |-src
#   | '-html
#   |   '-get-index
#   |     |-index.js
#   |     '-package.json
#   |-.arc
#   '-package.json
```

---

### a more complete .arc file
```
@app
hello

@html
get /
post /likes

@json
get /likes

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)

@tables
likes
  likeID *String
  update Lambda

@indexes
likes
  date *String
```

---

### Three Facets of .arc
- Declaritively define architecture with high level primitives in plain text in .arc
- Workflows to generate local code, configure, provision and deploy infrastructure
- Cloud function code itself

---

### Demo Time

🌩

---

### .arc: Before and After
Before
- Long dev/depoy cycles
- Inconsistent infrastructure deploys
- Bugs can be hard to trace

After
- Dev cycles are immediate
- Deployments run in seconds
- Infrastructure is consistent
- Bugs are easy to trace (and isolated!)
