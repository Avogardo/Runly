Test files should be located in the same directory as the file they are testing, and should have the same name as the file being tested, with '.test' added before the file extension. For example, if you are testing 'date.utils.ts', the test file should be named 'date.utils.test.ts'.
For testing use gherkin Given / When / And / Then notation

- Given - should contain given tested file context: for example for 'date.utils.ts' "Given date util"
- When - should contain tested function name: for example "When getDateFromString is called"
- And - should contain tested function parameters: for example "And date string is '2024-01-01'"
- Then - should contain expected result: for example "Then result should be a Date object representing January 1, 2024"
