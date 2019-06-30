Feature: Create Selector service extension for CapsulaHub

Background:
  Given Workspace
  And   SelectorService extension

 Scenario: SelectorService extension bootstrap function resolves correctly and triggers the registration of an instance of SelectorService in Workspace
   When  SelectorService extension bootstrap function is called
   And   The registration of SelectorService in Workspace is triggered with the correct arguments
   And   The promise, that is returned from the call of the bootstrap function, resolves with no args
   And   The returned promise from a call of registration function is resolved (only after the resolve of bootstrap function)

 Scenario: SelectorService extension bootstrap function rejects with an error if the creation of an instance of SelectorService throws an error
   When  SelectorService extension bootstrap function is called
   And   The creation of SelectorService instance fails with an error "Error1"
   Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "Error1"
   And   The registration of the SelectorService in Workspace was not triggered
