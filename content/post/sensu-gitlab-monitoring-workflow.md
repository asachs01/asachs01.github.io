---
title: Automated Monitoring Deployments with Sensu & Gitlab
date: 2020-01-03T13:28:53.000Z
description: Using CI/CD pipelines in Gitlab to push resources to Sensu
---
Work has kept me busy lately, but one thing that I've been working on is a Git-centric workflow for publishing Sensu resources. It's still a work in progress, but I figured I'd share the progress so far. 

## My Setup

### Gitlab

I'm currently using [Gitlab's][1] community edition in my home lab, which features the built-in CI/CD pipelines. My runners are all using their Docker executor, so all of the stages that are run are run inside containers.

### Stages

The CI config that I'm using looks like this:

```yaml
default:
  image: 
    name: sensu/sensu:5.15.0

stages:
  - lint-yaml
  - start-sensu
  - configure
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

configure sensu go:
  stage: configure
  rules:
    - if: '$CI_COMMIT_REF_NAME != "master"'
      when: always
  script:
  - sensu-backend start &
  - sleep 10
  - sensuctl configure -n --username "admin" --password 'P@ssw0rd!' --url "http://127.0.0.1:8080"

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
  - apk add --no-cache curl 
  - curl -L https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem.txt -o letsencrypt_ca_cert.pem
  - sensuctl configure -n --username "admin" --password 'XXXXXXXXXXX' --url "https://sensu.example.com:8080"
  - find . -type f \( -iname "*.yml" ! -iname ".*" \) -exec sensuctl create -f {} \;
  - sensuctl check listdefault:
  image: 
    name: sensu/sensu:5.15.0

stages:
  - lint-yaml
  - start-sensu
  - configure
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

configure sensu go:
  stage: configure
  rules:
    - if: '$CI_COMMIT_REF_NAME != "master"'
      when: always
  script:
  - sensu-backend start &
  - sleep 10
  - sensuctl configure -n --username "admin" --password 'P@ssw0rd!' --url "http://127.0.0.1:8080"

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
  - apk add --no-cache curl 
  - curl -L https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem.txt -o letsencrypt_ca_cert.pem
  - sensuctl configure -n --username "XXXXXXXXX" --password 'XXXXXXXXXXX' --url "https://sensu00.example.com:8080" 
  - find . -type f \( -iname "*.yml" ! -iname ".*" \) -exec sensuctl create -f {} \;
  - sensuctl check list

```


* Intro
*
* How you can do it

<!--LINKS-->

[1]: http://gitlab.com/http://gitlab.com/
[2]: 
[3]: 
[4]: 
[5]:
