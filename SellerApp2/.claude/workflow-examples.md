# Multi-Agent Workflow Examples

## **Feature Development Workflow**
```
1. Primary Claude receives: "Add product search functionality"
2. Mobile-Lead orchestrates:
   └── UI-Agent creates search components
   └── State-Agent manages search state
   └── API-Agent handles search API calls
3. Reviewer-Agent validates code quality
4. Result: Complete, tested feature
```

## **Bug Fixing Workflow**
```
1. Primary Claude receives: "App crashes on product list"
2. Debugger analyzes crash logs
3. Mobile-Lead identifies root cause
4. State-Agent fixes state management issue
5. Reviewer-Agent validates fix
6. Tester-Agent creates regression tests
```

## **Performance Optimization Workflow**
```
1. Primary Claude receives: "App is slow on product loading"
2. Performance-Agent analyzes bottlenecks
3. Mobile-Lead implements optimizations
4. Build-Agent optimizes bundle size
5. Monitor-Agent sets up performance tracking
```

## **Code Review Workflow**
```
1. Primary Claude receives: "Review this pull request"
2. Quality-Lead coordinates review:
   └── Reviewer-Agent checks code quality
   └── Performance-Agent checks optimization
   └── Security-Agent checks vulnerabilities
3. Consolidated feedback provided
```

## **Deployment Workflow**
```
1. Primary Claude receives: "Deploy to production"
2. Infrastructure-Lead manages:
   └── Build-Agent creates optimized build
   └── Deploy-Agent handles deployment
   └── Monitor-Agent sets up monitoring
3. Deployment complete with monitoring
```

## **Cross-Functional Collaboration**
```
Example: Payment Integration
├── Mobile-Lead (coordinates)
├── API-Agent (payment API integration)
├── State-Agent (payment state management)
├── UI-Agent (payment UI components)
├── Security-Agent (payment security review)
└── Tester-Agent (payment testing)
```

## **Agent Communication Patterns**

### **1. Sequential Processing**
Agents work in sequence, each building on previous work
```
Input → Agent1 → Agent2 → Agent3 → Output
```

### **2. Parallel Processing**
Multiple agents work simultaneously on different aspects
```
Input → {Agent1, Agent2, Agent3} → Merge → Output
```

### **3. Hierarchical Delegation**
Lead agents delegate to specialist agents
```
Primary → Lead → Specialists → Lead → Primary → Output
```

### **4. Collaborative Problem Solving**
Agents work together iteratively
```
Input → Agent1 ↔ Agent2 ↔ Agent3 → Consensus → Output
```