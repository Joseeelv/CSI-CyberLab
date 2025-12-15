// Wrapper to let TypeORM CLI load the TS data source via ts-node
require("ts-node").register({ transpileOnly: true });
require("tsconfig-paths").register();

const ds = require("./data-source.ts");
module.exports = ds.default ?? ds.AppDataSource ?? ds;
