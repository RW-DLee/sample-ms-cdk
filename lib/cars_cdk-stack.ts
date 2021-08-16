import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class CarsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //constants
    const code = new lambda.AssetCode('functions');
    const runtime = lambda.Runtime.NODEJS_12_X;

    //VPC is required to be used for RDS
    const vpc = new ec2.Vpc(this, 'CarsVPC');

    //define RDS Aurora Cluster
    const cluster = new rds.ServerlessCluster(this, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
      defaultDatabaseName: 'carsdb',
      vpc
    });

    //define cluster credentials and env
    const environment = {
      CLUSTER_ARN: cluster.clusterArn,
      SECRET_ARN: cluster.secret?.secretArn || '',
      DB_NAME: 'carsdb'
    }
        
    // Lambdas
    const getAll = new lambda.Function(this, 'getAllFunction', {
      code,
      runtime,
      handler: 'index.getAll',
      environment,      
    });

    const getCar = new lambda.Function(this, 'getCarFunction', {
      code,
      runtime,
      handler: 'index.getCar',
      environment,      
    });

    const addCar = new lambda.Function(this, 'addCarFunction', {
      code,
      runtime,
      handler: 'index.addCar',
      environment,      
    });

    const delCar = new lambda.Function(this, 'delCarFunction', {
      code,
      runtime,
      handler: 'index.delCar',
      environment,      
    });

    const delAll = new lambda.Function(this, 'delAllFunction', {
      code,
      runtime,
      handler: 'index.delAll',
      environment,      
    });

    const editCar = new lambda.Function(this, 'editCarFunction', {
      code,
      runtime,
      handler: 'index.editCar',
      environment,      
    });

    //enable lambda to access database
    cluster.grantDataApiAccess(getAll);
    cluster.grantDataApiAccess(getCar);
    cluster.grantDataApiAccess(addCar);
    cluster.grantDataApiAccess(delCar);
    cluster.grantDataApiAccess(delAll);
    cluster.grantDataApiAccess(editCar);

    //define apigateway rest endpoints
    const api = new apigw.RestApi(this, 'CarsAPI');
    const cars = api.root.addResource('cars');
    const singleCar = cars.addResource('{id}');

    //bind lambda with HTTP methods
    const getAllIntegration = new apigw.LambdaIntegration(getAll);
    cars.addMethod('GET', getAllIntegration);

    const getCarIntegration = new apigw.LambdaIntegration(getCar);
    singleCar.addMethod('GET', getCarIntegration);
    
    const addCarIntegration = new apigw.LambdaIntegration(addCar);
    cars.addMethod('POST', addCarIntegration);

    const delCarIntegration = new apigw.LambdaIntegration(delCar);
    singleCar.addMethod('DELETE', delCarIntegration);

    const delAllIntegration = new apigw.LambdaIntegration(delAll);
    cars.addMethod('DELETE', delAllIntegration);

    const editCarIntegration = new apigw.LambdaIntegration(editCar);
    singleCar.addMethod('PUT', editCarIntegration);

    //cloud formation output
    new cdk.CfnOutput(this, "API URL", {
      value: api.url ?? "Deployment failed...",
    });

  }
}
