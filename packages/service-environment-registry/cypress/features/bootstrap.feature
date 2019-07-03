Background:
Given Workspace
And   EnvRegistry extension

Scenario: EnvRegistry extension bootstrap function resolves correctly and triggers the registration of an instance of EnvRegistry in Workspace
  Given A valid EnvRegistry configuration with a token
  When  EnvRegistry extension bootstrap function is called with a Workspace as a first argument and EnvRegistry configuration as a second argument
  Then  Correct EnvRegistry configuration is applied while creating an instance of EnvRegistryService
  And   The registration of EnvRegistryService in Workspace is triggered with the correct arguments
  And   The promise, that is returned from the call of the bootstrap function, resolves with no args
  And   The returned promise from a call of registration function is resolved (only after the resolve of bootstrap function)

Scenario: EnvRegistry extension bootstrap function rejects with an error if the creation of an instance of EnvRegistry throws an error
  Given An invalid EnvRegistry configuration with a token
  When  EnvRegistry extension bootstrap function is called with a Workspace as a first argument and EnvRegistry configuration as a second argument
  And   The creation of EnvRegistryService instance fails with an error "Error1"
  Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "Error1"
  And   The registration of the service in Workspace was not triggered
