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

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const userProto = protoDescriptor.user as any;

const client = new userProto.userService(
  'localhost:50055', 
  grpc.credentials.createInsecure()
);

export default client;
