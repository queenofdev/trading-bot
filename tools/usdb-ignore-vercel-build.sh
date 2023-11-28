#!/usr/bin/env bash

## Name of the app to check. Change this to your application name!
APP=usdb
## All applications which are searching in affected files
ALL_APPS=(balance nft-market options usdb)

echo ">> Testing if should proceed with vercel build for app: $APP..."

## skip build for not whitelisted release branch
if [[ -z ${BALANCE_ALLOWED_RELEASE_BRANCH+x} ]]; then
  echo "Not using BALANCE_ALLOWED_RELEASE_BRANCH, with branch: [${VERCEL_GIT_COMMIT_REF}]"
else
  echo "Using BALANCE_ALLOWED_RELEASE_BRANCH: [${BALANCE_ALLOWED_RELEASE_BRANCH}], with branch: [${VERCEL_GIT_COMMIT_REF}]"
  if [[ "${VERCEL_GIT_COMMIT_REF}" == "main" || "${VERCEL_GIT_COMMIT_REF}" == release* ]]; then
    ## running from release branch and building different release branch, skip it fast
    if [[ "${VERCEL_GIT_COMMIT_REF}" != "${BALANCE_ALLOWED_RELEASE_BRANCH}" ]]; then
      echo "🛑 - Build cancelled"
      exit 0
    ## git branch and allowed release branch are same, build it, now!
    else
      echo "✅ - Build can proceed"
      exit 1
    fi
  fi
fi

## Get affected files from comparing latest commit to the one before that
echo ">> Checking if app: $APP is affected by latest commit..."
git diff --name-only HEAD~1 HEAD
# shellcheck disable=SC2207
AFFECTED_FILES=($(git diff --name-only HEAD~1 HEAD))

## Found affected apps from given relative paths
AFFECTED_APPS=()
for app in "${ALL_APPS[@]}"; do
  if echo "${AFFECTED_FILES[@]}" | grep "apps/$app"; then
    AFFECTED_APPS+=("$app")
  fi
done

## If change is in common files it has to be affected
if [[ ${#AFFECTED_APPS[@]} -eq 0 ]]; then
  echo ">>> Not found any affected app"
  IS_APP_AFFECTED=true
## If change is in at least one app, check if our is between them
else
  # shellcheck disable=SC2076
  if [[ " ${AFFECTED_APPS[*]} " =~ " ${APP} " ]]; then
    echo ">>> Affected with current app, all apps: (${AFFECTED_APPS[*]})"
    IS_APP_AFFECTED=true
  else
    echo ">>> Not affected with current app, all apps: (${AFFECTED_APPS[*]})"
    IS_APP_AFFECTED=false
  fi

fi

if ! $IS_APP_AFFECTED; then
  echo "🛑 - Build cancelled"
  exit 0
elif $IS_APP_AFFECTED; then
  echo "✅ - Build can proceed"
  exit 1
fi
