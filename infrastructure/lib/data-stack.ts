import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class DataStack extends cdk.Stack {
  database: Table;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const database = new Table(this, 'pwa-demo-app', {
      partitionKey: { name: 'endpoint', type: AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
      tableName: 'pws-demo-app',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.database = database;

    database.addGlobalSecondaryIndex({
      indexName: 'byGroup',
      partitionKey: { name: 'userPoolGroup', type: AttributeType.STRING },
      sortKey: { name: 'userId', type: AttributeType.STRING },
    });
  }
}
