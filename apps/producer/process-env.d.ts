declare namespace NodeJS {
  interface ProcessEnv {
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
    readonly bucketName: string;
    readonly region: string;
    readonly rabbitMqURL: string;
    readonly port: string;
    readonly googleApiKey: string;
    readonly credFileName: string;
  }
}
