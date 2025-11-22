# Agent Invocation Guide

## **How to Invoke All 13 Agents**

### **Method 1: Direct Command Line**
```bash
# Load all agents
claude --agents "$(cat .claude/hierarchical-agents.json)" "your task here"

# Or load simple agents
claude --agents "$(cat .claude/agents.json)" "your task here"
```

### **Method 2: Session-Based**
```bash
# Start session with all agents
claude --agents "$(cat .claude/hierarchical-agents.json)"

# Then use keywords to trigger specific agents
```

## **Agent Trigger Keywords**

### **Primary Level**
- **🎯 Primary Claude** - Default, no keywords needed

### **Tier 2 Leads**
- **📱 Mobile Development Lead**
  - Keywords: `mobile`, `app development`, `react native`, `feature`, `component`
  - Example: "Implement new mobile feature"

- **🔍 Quality Assurance Lead**
  - Keywords: `quality`, `review`, `testing`, `code quality`, `audit`
  - Example: "Review this code for quality"

- **🏗️ Infrastructure Lead**
  - Keywords: `build`, `deploy`, `infrastructure`, `ci/cd`, `monitoring`
  - Example: "Set up build pipeline"

### **Tier 3 Specialists**
- **🎨 UI Components Specialist**
  - Keywords: `ui`, `component`, `styling`, `interface`, `layout`
  - Example: "Create a product card component"

- **🔄 State Management Specialist**
  - Keywords: `state`, `redux`, `context`, `store`, `data flow`
  - Example: "Fix state management issue"

- **🌐 API Integration Specialist**
  - Keywords: `api`, `fetch`, `request`, `endpoint`, `integration`
  - Example: "Integrate payment API"

- **📋 Code Review Specialist**
  - Keywords: `code review`, `best practices`, `refactor`, `optimize`
  - Example: "Review this pull request"

- **🧪 Testing Specialist**
  - Keywords: `test`, `unit test`, `e2e`, `testing`, `coverage`
  - Example: "Write tests for auth module"

- **⚡ Performance Specialist**
  - Keywords: `performance`, `optimize`, `speed`, `memory`, `benchmark`
  - Example: "Optimize app performance"

- **🔨 Build Specialist**
  - Keywords: `build`, `compile`, `dependencies`, `bundle`, `webpack`
  - Example: "Fix build error"

- **🚀 Deployment Specialist**
  - Keywords: `deploy`, `release`, `production`, `environment`, `ci/cd`
  - Example: "Deploy to production"

- **📊 Monitoring Specialist**
  - Keywords: `monitoring`, `logging`, `analytics`, `metrics`, `tracking`
  - Example: "Set up error monitoring"

## **Smart Agent Selection**

### **Automatic Selection**
Claude automatically selects agents based on keywords in your request.

### **Manual Selection**
```bash
# Specify exact agent
claude --agents '{"mobile-lead": {"description": "Mobile lead"}}' "Create new feature"

# Multiple agents
claude --agents '{"mobile-lead": {...}, "quality-lead": {...}}' "Develop and review feature"
```

### **Workflow Triggers**
```bash
# Feature development workflow
"Develop a new feature with UI, state management, and API integration"

# Quality check workflow
"Review, test, and optimize this code"

# Deployment workflow
"Build, test, and deploy this feature"
```

## **Example Invocations**

### **Single Agent**
```bash
claude --agents "$(cat .claude/hierarchical-agents.json)" "Create a beautiful product card component"
# Triggers: 🎨 UI Components Specialist
```

### **Multi-Agent Collaboration**
```bash
claude --agents "$(cat .claude/hierarchical-agents.json)" "Implement user authentication with login UI, state management, API integration, and testing"
# Triggers: 📱 Mobile Lead → 🎨 UI + 🔄 State + 🌐 API + 🧪 Testing
```

### **Complete Workflow**
```bash
claude --agents "$(cat .claude/hierarchical-agents.json)" "Build, test, review, and deploy a new product search feature"
# Triggers: Complete workflow with all relevant agents
```

## **Advanced Patterns**

### **Sequential Processing**
- Use "then", "after that", "next" to chain agents
- Example: "Create component, then review it, then test it"

### **Parallel Processing**
- Use "and", "also", "simultaneously" for parallel work
- Example: "Review code and test performance"

### **Hierarchical Delegation**
- Start with lead agent keywords for complex tasks
- Example: "Mobile team, implement this feature"

## **Pro Tips**
1. **Be specific** with keywords for better agent selection
2. **Use workflow keywords** for multi-agent tasks
3. **Combine keywords** for complex scenarios
4. **Start simple** with single agents, then scale up