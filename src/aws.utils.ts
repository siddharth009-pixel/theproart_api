import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export async function getPEMFromSecretsManager(secretName: string): Promise<string> {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        console.log("data", data);
        if (data.SecretString) {
            return data.SecretString;
        }
        throw new Error('PEM content is empty');
    } catch (error) {
        console.error(`Error retrieving secret ${secretName}: `, error);
        throw error;
    }
}
