import { objectTypes } from "./objects";
import { documentTypes, singletonTypes } from "./documents";

export const schemaTypes = [...objectTypes, ...documentTypes];
export { singletonTypes };
