# Claude Agents Configuration

This directory contains custom Claude agents configured for this project.

## Available Agents

### 1. GLM-4.6 Assistant (`glm-46-assistant`)
- **Purpose**: General React Native development assistance
- **Specialization**: Mobile app development, TypeScript, e-commerce functionality
- **Use for**: Code implementation, feature development, troubleshooting

### 2. Code Reviewer (`code-reviewer`)
- **Purpose**: Code quality assessment and review
- **Specialization**: React Native best practices, performance optimization
- **Use for**: Code reviews, quality checks, optimization suggestions

### 3. Debugger (`debugger`)
- **Purpose**: Debugging and issue resolution
- **Specialization**: React Native debugging, platform-specific issues
- **Use for**: Error troubleshooting, performance debugging, build issues

## How to Use

### Command Line
```bash
# Use a specific agent
claude --agents '{"glm-46-assistant": {"description": "GLM-4.6 assistant"}}' "your prompt here"

# Use with the agents.json configuration
claude --agents "$(cat .claude/agents.json)" "your prompt here"
```

### Configuration Files
- `agents.json`: Main agent configuration
- Individual agent files in `agents/` directory contain detailed documentation

## Adding New Agents

1. Create a new agent markdown file in the `agents/` directory
2. Add the agent configuration to `agents.json`
3. Test the agent configuration using the command line

## Agent Customization for GLM-4.6

All agents are optimized for GLM-4.6 architecture with:
- Enhanced context understanding
- Improved code analysis capabilities
- Better mobile development insights
- Optimized tool usage patterns