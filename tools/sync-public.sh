#!/bin/bash
# Sync private repo to public repo with sensitive values scrubbed
# Usage: ./tools/sync-public.sh

set -e

PRIVATE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC_DIR="/root/.openclaw/workspace/openclaw-business"
SCRUB_PATTERNS=(
  "s/vpc-REPLACE_ME/vpc-REPLACE_ME/g"
  "s/subnet-REPLACE_ME_1/subnet-REPLACE_ME_1/g"
  "s/subnet-REPLACE_ME_2/subnet-REPLACE_ME_2/g"
  "s/sg-REPLACE_ME/sg-REPLACE_ME/g"
  "s/ACCOUNT_ID/ACCOUNT_ID_REPLACE_ME/g"
  "s/molinar-terraform-state/your-terraform-state-bucket/g"
  "s|openclaw-business/terraform.tfstate|your-project/terraform.tfstate|g"
)

echo "📦 Syncing private → public (with scrubbing)..."

# Copy all files except .git (use cp if rsync unavailable)
if command -v rsync &>/dev/null; then
  rsync -a --delete --exclude='.git' --exclude='tools/sync-public.sh' "$PRIVATE_DIR/" "$PUBLIC_DIR/"
else
  # Fallback: remove non-git files, copy fresh
  find "$PUBLIC_DIR" -maxdepth 1 -not -name '.git' -not -path "$PUBLIC_DIR" -exec rm -rf {} +
  cp -a "$PRIVATE_DIR"/. "$PUBLIC_DIR/"
  rm -rf "$PUBLIC_DIR/.git"
  cd "$PUBLIC_DIR" && git checkout .git 2>/dev/null || true
fi

# Scrub sensitive values in infra files
for pattern in "${SCRUB_PATTERNS[@]}"; do
  find "$PUBLIC_DIR/infra" -type f \( -name "*.tf" -o -name "*.md" \) -exec sed -i "$pattern" {} +
done

# Commit and push public
cd "$PUBLIC_DIR"
git add -A
if git diff --cached --quiet; then
  echo "✅ Public repo already in sync"
else
  git -c user.name="Matthew Molinar" -c user.email="matthew.a.molinar@gmail.com" \
    commit -m "sync: mirror from private repo (scrubbed)"
  git push origin main
  echo "✅ Public repo updated and pushed"
fi
