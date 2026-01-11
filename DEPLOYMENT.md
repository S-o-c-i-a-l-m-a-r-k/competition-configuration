# Deployment Guide - jsDelivr CDN + GitHub

## Overview

This guide explains how to deploy the Competition Configuration Tool as an embeddable widget using jsDelivr CDN to serve files directly from GitHub.

## Why jsDelivr CDN + GitHub?

**Benefits:**
- ✅ **Free forever** - No hosting costs
- ✅ **Fast global CDN** - Files served from nearest edge location
- ✅ **No infrastructure** - GitHub hosts, jsDelivr serves
- ✅ **Version control** - Use Git tags for versioning
- ✅ **Auto-updates** - Push to GitHub, changes go live
- ✅ **Simple deployment** - Just git push
- ✅ **Production-ready** - Used by millions of projects

## Deployment Steps

### 1. Push to GitHub

```bash
cd /path/to/competition-configuration
git init
git add .
git commit -m "Initial commit - Competition Configuration Widget"
git remote add origin https://github.com/username/competition-configuration.git
git push -u origin main
```

Replace `username/competition-configuration` with your actual GitHub username and repository name.

### 2. Create a Git Tag for Versioning (Optional but Recommended)

```bash
# Tag your first release
git tag v1.0.0
git push origin v1.0.0
```

This allows users to pin to specific versions.

### 3. jsDelivr URLs Are Instantly Available

No signup or configuration needed! jsDelivr automatically serves from any public GitHub repo.

**URL format:**
```
https://cdn.jsdelivr.net/gh/username/repo@version/file
```

**Examples:**

Latest version (main branch):
```html
<script src="https://cdn.jsdelivr.net/gh/username/competition-configuration@main/widget.js"></script>
```

Specific version (recommended for production):
```html
<script src="https://cdn.jsdelivr.net/gh/username/competition-configuration@v1.0.0/widget.js"></script>
```

Latest 1.x version (auto-updates to latest 1.x):
```html
<script src="https://cdn.jsdelivr.net/gh/username/competition-configuration@1/widget.js"></script>
```

## Usage in Projects

### Basic Embedding

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Project</title>
</head>
<body>
    <!-- Your page content -->

    <!-- Widget container -->
    <div id="competition-config"></div>

    <!-- Load widget from CDN -->
    <script src="https://cdn.jsdelivr.net/gh/username/competition-configuration@v1.0.0/widget.js"></script>

    <!-- Initialize widget -->
    <script>
        CompetitionConfig.init('competition-config');
    </script>
</body>
</html>
```

## Version Management

### Semantic Versioning

Use semantic versioning for your releases:

- **v1.0.0** - Major version (breaking changes)
- **v1.1.0** - Minor version (new features, backwards compatible)
- **v1.0.1** - Patch version (bug fixes)

### Creating New Versions

```bash
# Make your changes
git add .
git commit -m "Add new feature X"

# Tag the new version
git tag v1.1.0
git push origin main
git push origin v1.1.0
```

jsDelivr will automatically serve the new version within minutes.

### Version Strategy for Users

**Production (Recommended):**
```html
<!-- Pin to specific version - never changes -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@v1.0.0/widget.js"></script>
```

**Auto-update to latest patch:**
```html
<!-- Auto-updates to latest 1.0.x version -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@1.0/widget.js"></script>
```

**Auto-update to latest minor:**
```html
<!-- Auto-updates to latest 1.x version -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@1/widget.js"></script>
```

**Always latest (Not recommended for production):**
```html
<!-- Always latest from main branch - can break -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@main/widget.js"></script>
```

## File Structure

```
competition-configuration/
├── widget.js                      # Main widget file (what users include)
├── widget-demo.html               # Standalone demo page showing usage
├── demo.js                        # Comprehensive demo script
├── package.json                   # Package configuration
├── README.md                      # Main project documentation
├── DEPLOYMENT.md                  # This file
├── docs/                          # Documentation
│   ├── CONFIGURATION_GUIDE.md     # Configuration workflow guide
│   ├── CONSTRAINTS_REFERENCE.md   # Complete constraints reference
│   ├── WEB_INTERFACE_GUIDE.md     # Web interface guide
│   ├── WIDGET_GUIDE.md            # Widget usage guide
│   └── PROJECT_REFERENCE.md       # Project plan & requirements
└── src/                           # Node.js API source code
    ├── models/
    │   ├── Round.js
    │   └── Competition.js
    ├── calculators/
    │   └── RoundCalculator.js
    ├── validators/
    │   └── CompetitionValidator.js
    └── index.js
```

## Updating the Widget

### For Bug Fixes (Patch)

```bash
# Fix the bug in widget.js
git add widget.js
git commit -m "Fix: Correct date formatting issue"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

Users pinned to `v1.0.0` won't get the update.
Users using `@1.0` or `@1` will get the update automatically.

### For New Features (Minor)

```bash
# Add new feature to widget.js
git add widget.js
git commit -m "Feature: Add export to CSV"
git tag v1.1.0
git push origin main
git push origin v1.1.0
```

Users pinned to `v1.0.0` won't get the update.
Users using `@1` will get the update automatically.

### For Breaking Changes (Major)

```bash
# Make breaking changes to widget.js
git add widget.js
git commit -m "Breaking: Change init API signature"
git tag v2.0.0
git push origin main
git push origin v2.0.0
```

Users must explicitly update to `@2.0.0` or `@2`.

## jsDelivr Features

### Cache Purging

If you need to force jsDelivr to refresh a specific version:

```bash
# Purge cache for a specific file
curl https://purge.jsdelivr.net/gh/user/repo@1.0.0/widget.js
```

### CDN Statistics

View usage statistics for your files:
```
https://www.jsdelivr.com/package/gh/username/competition-configuration
```

### Combining Files

jsDelivr can combine multiple files (if needed in future):
```html
<script src="https://cdn.jsdelivr.net/combine/gh/user/repo@1/widget.js,gh/user/repo@1/plugin.js"></script>
```

## Multiple Projects Using the Widget

### Scenario: Using in 2+ projects

**Project A:**
```html
<div id="comp-config-a"></div>
<script src="https://cdn.jsdelivr.net/gh/user/repo@1.0.0/widget.js"></script>
<script>CompetitionConfig.init('comp-config-a');</script>
```

**Project B:**
```html
<div id="comp-config-b"></div>
<script src="https://cdn.jsdelivr.net/gh/user/repo@1.0.0/widget.js"></script>
<script>CompetitionConfig.init('comp-config-b');</script>
```

**Benefits:**
1. Both projects use the same CDN URL
2. File cached once in user's browser, benefits both projects
3. Update widget once (push to GitHub), both projects can update
4. No package.json, no npm install, no build step

### Update Strategy for Multiple Projects

**Conservative (Recommended):**
- Pin each project to specific versions
- Test updates in staging before changing version
- Update each project's version independently

**Progressive:**
- Use `@1` to get latest 1.x automatically
- Widget updates apply to all projects
- Test widget changes thoroughly before pushing

## Testing Before Deployment

### Test Locally

```bash
# Serve locally for testing
python3 -m http.server 8000
# Or
npx serve
```

Visit: `http://localhost:8000/widget-demo.html`

### Test from GitHub (Before Creating Release Tag)

Use `@main` branch for testing:
```html
<script src="https://cdn.jsdelivr.net/gh/user/repo@main/widget.js"></script>
```

Once tested, create a release tag.

## Deployment Checklist

Before tagging a new release:

- [ ] Test widget locally with `widget-demo.html`
- [ ] Verify all features work as expected
- [ ] Check browser console for errors
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Update version number in this file
- [ ] Commit all changes
- [ ] Create and push Git tag
- [ ] Wait 5 minutes for jsDelivr to pick up changes
- [ ] Test CDN URL in browser
- [ ] Update documentation with new version

## Rollback Strategy

If a deployed version has issues:

```bash
# Delete the problematic tag locally
git tag -d v1.1.0

# Delete from remote
git push origin :refs/tags/v1.1.0

# Create a new patch with the fix
git tag v1.1.1
git push origin v1.1.1
```

Users pinned to `v1.1.0` will continue using it (cached).
Users on `@1.1` or `@1` will automatically get `v1.1.1`.

## FAQ

**Q: How long does it take for changes to appear on jsDelivr?**
A: Usually 1-5 minutes after pushing to GitHub.

**Q: Can I use a private repository?**
A: No, jsDelivr only works with public GitHub repositories.

**Q: What if GitHub is down?**
A: jsDelivr caches files permanently, so they remain available even if GitHub is down.

**Q: Is there a file size limit?**
A: jsDelivr recommends keeping files under 50MB. Our widget.js is ~46KB, well within limits.

**Q: Can I see download statistics?**
A: Yes, visit: `https://www.jsdelivr.com/package/gh/username/repo`

**Q: Does it work with GitHub branches?**
A: Yes! Use `@branch-name` instead of `@version`.

**Q: Can I test before making public?**
A: Yes, push to a feature branch and use `@feature-branch` in your test page.

## Alternative CDN Options

If you want to explore alternatives to jsDelivr:

1. **unpkg.com** - Also serves from GitHub, similar syntax
   ```html
   <script src="https://unpkg.com/username/repo@1.0.0/widget.js"></script>
   ```

2. **GitHub Pages** - Host directly from GitHub
   - Enable GitHub Pages in repo settings
   - Access via `https://username.github.io/repo/widget.js`

3. **Cloudflare Pages** - Free CDN with GitHub integration

## Summary

**Deployment Process:**
1. Push code to GitHub → Instant
2. Create Git tag → Instant
3. jsDelivr serves files → 1-5 minutes
4. Users include widget → Works immediately

**Update Process:**
1. Make changes locally
2. Commit and push to GitHub
3. Create new version tag
4. Push tag to GitHub
5. jsDelivr automatically serves new version
6. Users get updates based on their version strategy

**Best Practices:**
- ✅ Use semantic versioning
- ✅ Pin production sites to specific versions
- ✅ Test thoroughly before tagging releases
- ✅ Document breaking changes clearly
- ✅ Provide migration guides for major versions
- ✅ Keep widget.js self-contained and optimized

**Result:**
A production-ready, globally distributed widget that:
- Costs $0 to host
- Updates with a simple `git push`
- Works in unlimited projects
- Requires no infrastructure management
- Scales automatically
- Provides version control

Your widget is now ready for production deployment! 🚀
