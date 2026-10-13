#!/usr/bin/env bash
set -euo pipefail

if [[ "$GITHUB_REF_NAME" != "main" ]]; then
  version="dev-${GITHUB_SHA::12}"
  echo "new_version=$version" >> "$GITHUB_OUTPUT"
  echo "version_number=$version" >> "$GITHUB_OUTPUT"
  echo "release_required=false" >> "$GITHUB_OUTPUT"
  echo "Imagem de desenvolvimento: $version"
  exit 0
fi

# Uma tag mais recente no histórico pode ter um número menor que uma tag anterior.
# Use a maior versão estável alcançável para impedir regressões de versão.
mapfile -t tags < <(git tag --merged HEAD --list 'v*' |
  grep -E '^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$')

if ((${#tags[@]})); then
  last_tag="v$(semver "${tags[@]}" | tail -n 1)"
  range="${last_tag}..HEAD"
else
  last_tag="v0.0.0"
  range="HEAD"
fi

echo "Maior tag SemVer alcançável: $last_tag"
subjects=$(git log "$range" --format=%s)

if [[ -z "$subjects" ]]; then
  echo "new_version=$last_tag" >> "$GITHUB_OUTPUT"
  echo "version_number=${last_tag#v}" >> "$GITHUB_OUTPUT"
  echo "release_required=false" >> "$GITHUB_OUTPUT"
  echo "Nenhum commit novo; mantendo $last_tag"
  exit 0
fi

messages=$(git log "$range" --format=%B)

if grep -Eq '^[[:alpha:]][[:alnum:]-]*(\([^)]*\))?!:' <<< "$subjects" ||
   grep -Eq '^BREAKING[ -]CHANGE:' <<< "$messages"; then
  bump="major"
elif grep -Eq '^feat(\([^)]*\))?:' <<< "$subjects"; then
  bump="minor"
else
  bump="patch"
fi

version=$(semver -i "$bump" "${last_tag#v}")
echo "new_version=v$version" >> "$GITHUB_OUTPUT"
echo "version_number=$version" >> "$GITHUB_OUTPUT"
echo "release_required=true" >> "$GITHUB_OUTPUT"
echo "Nova versão: v$version ($bump)"
