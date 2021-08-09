// to find all postgres queries in the project, find all occurrences that match this pattern:
export const postgresQueriesPattern = /await (pool|client)\s*\.query\((.|\n)*?\)(\.then\((.|\n)*?\))*\s*(?!\.catch)/
