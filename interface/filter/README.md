 # Filter component
 This is a generalised backend component for filtering a dataset.
 
## Patterns to observe
### Logging
Every function which queries the database should have a `Timer()` instance to time its operations. All queries should be ended with a `.catch((e) => timer.postgresError(e))` to correctly log out any database errors.

### Interface
To make the functions easier to use elsewhere, and reduce `TypeError`'s, all functions should have a JSDoc comment describing what the function does, and if necessary an `@example` showing how its expected to be used. The input params and output should be typed in the same file as the function, and exported to be used elsewhere.

### Parameters and output
All functions should take a single argument parameter. This should be an `Object` containing the individual parameters needed. Such as `{ filters, category }`. This makes it easier to pass parameters in, and get them out by name. It means that adding parameters in future won't break existing usages. It also removes the need for remembering the order of parameters. Similarly, every function should return a single `Object` which can contain any values the function needs to return. For example `{ count: 5 }` 
