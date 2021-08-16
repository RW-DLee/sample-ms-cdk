# SAMPLE MS CDK PROJECT - Cars Database API (CRUD through API Endpoints)

**To Deploy:**
**"npm run deploy"**

The project is built in Typescript.
npm run deploy will compile the .ts files to .js files. Run synthesize to create files for CloudFormation, then finally deploy.

The deployment will create a stack that contains constructs:
  EC2 with VPC configured,
  RDS (Aurora Database with MySQL engine), 
  Lambda functions that act as the controller,
  API Gateway tied to the Lambda functions with HTTP methods
  CloudFormation output that contains the API URL
  
***Prior to deployment please make sure AWS CLI is installed and the "credentials" && "config" files are created through "aws configure" command in the terminal***

Once the deployment runs successfully (verified through going into AWS console and checking Cloud Formation Resources),
Assign the Secret ARN to the RDS database through the console.

Copy ARN Secret from "AWS Secrets Manager"
Step 1. AWS -> Secrets Manager -> "Click on Secret Generated from CDK Stack" -> "Copy **Secret ARN**"

Step 2. AWS -> RDS -> DB Cluster -> Actions -> Query -> "Fill in Credentials" -> Connect to Database
  Database username: "Connect with a Secrets Manager ARN"
  Secrets manager ARN: "Paste value from Step 1.
  Enter the name of the database or schema: "carsdb"
 
Step 3. Create a table called "cars" through the console after following step 2. 
Copy and paste the following query then run: "CREATE TABLE cars (id VARCHAR(255) UNIQUE, make VARCHAR(255), model VARCHAR(255));"

After all steps, you should now be able to interact with the database with the supplied API URL. 
The API URL can be found in API Gateway and/or as output after deployment via terminal.

