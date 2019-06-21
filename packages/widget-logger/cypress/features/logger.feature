Scenario: Events are logged (check the format)
  Given Logger web component
  And  Logger is initialized
  When each time a new log event occurs
  Then the log is recorded in the Logger
  And  each log has the correct model
    | property    | type                 |
    | timestamp   | number               |
    | type        | 'request'/'response' |
    | serviceName | string               |
    | methodName  | string               |
    | data        | object               |
  And the arrows icons have correspondent color according to the type (green for request, red for response)
  And there is an inactive dot at the beggining of each log row

Scenario: Check delete cross to remove all logs
  Given Logger web component
  And  Logger is initialized
  And  several logs are recorded
  When click on the delete cross
  Then all recorded logs are removed
  And  other logs continue to be recorded afterwards

Scenario: Hover/click on the dot next to a log - all dots of the logs with same correlationId become active
  Given Logger web component
  And  Logger is initialized
  And  several logs with different correlationId are recorded
  When hover/click on the dot near to a log
  Then the dot becomes active, and all dots of the logs with same correlationId become active
  And  the dots of the logs with other correlationId are inactive
  And  if unhover/click again on the dot will make the active dots inactive
