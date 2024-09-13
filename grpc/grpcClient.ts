import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load .proto file
const PROTO_PATH = path.resolve(process.cwd(), 'proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load gRPC package
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const userProto = protoDescriptor.user as any;

// Create gRPC client
const client = new userProto.userService(
  'localhost:50055', // gRPC server address
  grpc.credentials.createInsecure()
);

export default client;
