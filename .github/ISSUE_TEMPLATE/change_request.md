---
name: Change Request/New Feature Request
about: Suggest a change in exist feature or the creation of a new feature
title: ''
labels: 'feature'
assignees: ''
---

## General description
The general description of the change/feature, that will explain the core value and why it's needed.

#### List of core packages that if affects
List all the core packages that this changes will affect.

#### Prerequisites
Links to any external dependency for this feature

## API

#### Design description

A clear and concise description of the design proposition.

1) Is it backward compatible? - Yes/No
2) Adds new API - Yes/No
3) Changes existing API - Yes/No
4) Removes existing API - Yes/No

#### Changes

Provide link to a PR or code snippet of old and new API.

## Technical considerations

List of everything to consider before writing test cases.

## Behavior

1) Does the suggested changes impact the current behaviour? - Yes/No
<!-- If yes, specify which behaviour will be changed and how or provide the link to a PR.-->
2) Are the suggested changes specific to some devices/browsers/environments? - Yes/No
<!-- If yes, specify which devices/browsers/environments -->
3) Does the suggested changes require to add new dependencies to the package? - Yes/No
<!-- If yes, provide the list of dependencies and explain why it's required. -->

Describe the feature behavior the best you can using _**[Gherkin Syntax](https://docs.cucumber.io/gherkin/reference/)**_.

## Test cases

Link to the PR with test cases, that are written in _**[Gherkin Syntax](https://docs.cucumber.io/gherkin/reference/)**_ and cover all the possible scenarios.

## Ready for implementation
- [ ] External dependencies have been resolved
- [ ] API has been approved
- [ ] Test cases have been prepared
- [ ] Discussed with Technical lead

## Definition of Done
- [ ] Maintainer review
- [ ] All tests are implemented <!-- automatic testing -->
- [ ] Manual QA
- [ ] Documentation
- [ ] Release notes
