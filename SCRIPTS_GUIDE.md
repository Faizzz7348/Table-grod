# 🚀 Deployment & Scripts Guide

Terlalu banyak scripts? Ini guide mudah untuk semua!

---

## ⚡ QUICK START - Yang Anda Patut Guna

### 🎯 Deploy ke Vercel (Recommended)

```bash
# Full deployment - Build + Commit + Deploy
bash deploy.sh

# Custom commit message
bash deploy.sh "feat: add new feature"
```

```bash
# Quick deploy - Skip build (guna bila dah build)
bash quick-deploy.sh

# With custom message
bash quick-deploy.sh "fix: urgent hotfix"
```

---

## 📋 ALL SCRIPTS EXPLAINED

### ✅ **DEPLOYMENT SCRIPTS** (Guna ini!)

| Script | Kegunaan | Command |
|--------|----------|---------|
| **deploy.sh** | Build → Commit → Deploy | `bash deploy.sh` |
| **quick-deploy.sh** | Skip build, terus deploy | `bash quick-deploy.sh` |

### 🔧 **MAINTENANCE SCRIPTS**

| Script | Kegunaan | Bila Guna |
|--------|----------|-----------|
| **clear-cache.sh** | Clear npm/build cache | Build error/masalah |
| **build-optimized.sh** | Build sahaja | Test build locally |
| **setup-neon.sh** | Setup Neon database | First time setup |

### 🩺 **DIAGNOSTIC SCRIPTS**

| Script | Kegunaan | Bila Guna |
|--------|----------|-----------|
| **diagnose-vercel.sh** | Check Vercel config | Deployment issues |
| **quick-fix-blank.sh** | Interactive blank page fix | White screen error |

### 📚 **DOCUMENTATION HELPERS**

| Script | Kegunaan |
|--------|----------|
| **VITE_API_URL_VISUAL_GUIDE.sh** | Visual guide untuk API URL |
| **VITE_API_URL_QUICK_REF.sh** | Quick reference |
| **cleanup-docs.sh** | Cleanup duplicate docs |

### ⚠️ **OLD SCRIPTS (Boleh ignore/delete)**

| Script | Status | Alternative |
|--------|--------|-------------|
| commit.sh | ❌ Outdated | Guna `deploy.sh` |
| commit-fixes.sh | ❌ Outdated | Guna `deploy.sh` |
| commit-optimization.sh | ❌ Outdated | Guna `deploy.sh` |

---

## 💡 COMMON WORKFLOWS

### 1️⃣ Normal Development & Deploy
```bash
# Make changes to code...
# Then deploy:
bash deploy.sh "feat: my new feature"
```

### 2️⃣ Quick Hotfix
```bash
# Fix bug...
bash quick-deploy.sh "fix: critical bug"
```

### 3️⃣ Build Issues / Cache Problems
```bash
bash clear-cache.sh
npm install
bash deploy.sh
```

### 4️⃣ Blank Page Issue
```bash
bash quick-fix-blank.sh  # Follow interactive prompts
```

---

## 🧹 CLEANUP RECOMMENDATION

**Boleh DELETE files ini** (already outdated):
- ❌ `commit.sh`
- ❌ `commit-fixes.sh`
- ❌ `commit-optimization.sh`

**GUNA yang baru:**
- ✅ `deploy.sh` - One script to rule them all!
- ✅ `quick-deploy.sh` - For speed

---

## 🎯 TL;DR - YANG PENTING SAHAJA

```bash
# Deploy everything
bash deploy.sh

# That's it! 🎉
```

---

**Note:** Semua scripts dah configured untuk `/workspaces/Table-grod` directory.
