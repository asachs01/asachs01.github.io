---
title: Automated Monitoring Deployments with Sensu & Gitlab
date: 2020-01-03T13:28:53.000Z
description: Using CI/CD pipelines in Gitlab to push resources to Sensu
---
Work has kept me busy lately, but one thing that I've been working on is a Git-centric workflow for publishing Sensu resources. It's still a work in progress, but I figured I'd share the progress so far. 

I'm currently using [Gitlab's](http://gitlab.com/) community edition in my home lab, which features the built-in CI/CD pipelines. My runners are all using their Docker executor, so all of the stages that are run are run inside containers. I won't go into getting all of that set up and configured, but Gitlab's docs did a great job of guiding me through everything I needed.

There are 4 stages that I have configured. The first is to lint the yaml files that get pushed to the repo. The second stage configures Sensu and then applies the resources--both this stage and the first stage only run if the branch isn't `master`. The last stage will deploy the checks to a production cluster. I'll note here that for the purposes of Sensu's yaml-formatted resources, I have a custom `.yamllint` file so that the initial linting stage doesn't completely fail out. It looks like this:

```yaml
extends: relaxed

ignore: |
  .gitlab-ci.yml

rules:
  line-length:
    max: 120
    level: warning
  indentation:
    spaces: 2
    indent-sequences: false

```

Here's the CI config that I'm using to make all of this happen:

```yaml
default:
  image: 
    name: sensu/sensu:5.15.0

stages:
  - lint-yaml
  - deploy-staging
  - deploy-prod

lint yaml:
  stage: lint-yaml
  rules:
    - if: '$CI_COMMIT_REF_NAME != "master"'
      when: always
  script:
  - apk add --no-cache py3-setuptools
  - pip3 install --no-cache-dir yamllint
  - yamllint .

deploy checks to staging:
  stage: deploy-staging
  rules:
    - if: '$CI_COMMIT_REF_NAME != "master"'
      when: always
  script:
  - sensu-backend start &
  - sleep 10
  - sensuctl configure -n --username "admin" --password 'P@ssw0rd!' --url "http://127.0.0.1:8080"
  - find . -type f \( -iname "*.yml" ! -iname ".*" \) -exec sensuctl create -f {} \;
  - sensuctl check list

deploy checks to prod:
  stage: deploy-prod
  rules:
    - if: '$CI_COMMIT_REF_NAME == "master"'
      when: always
  script:
  - sensuctl configure -n --username "XXXXXXXXX" --password 'XXXXXXXXXXX' --url "https://sensu.example.com:8080" 
  - find . -type f \( -iname "*.yml" ! -iname ".*" \) -exec sensuctl create -f {} \;
  - sensuctl check list
```

There are some obvious places to improve. For example, what if I need to roll back a check? What about using a service account in Sensu to have the checks applied? What about having a CI job that opens a merge request if all of other stages pass? What about only checking the individual resource that's been committed instead of checking all the files? 

These are all things that could be done, of course. But hey, this is just the start! 


<!--LINKS-->

[1]: https://gitlab.com

