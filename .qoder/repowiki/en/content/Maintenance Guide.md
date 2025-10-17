# Maintenance Guide

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [agents.md](file://agents.md)
- [answers.json](file://answers.json)
- [api/submit.js](file://api/submit.js)
- [api/generate-result.js](file://api/generate-result.js)
- [api/stats.js](file://api/stats.js)
- [package.json](file://package.json)
- [vercel.json](file://vercel.json)
- [quiz.html](file://quiz.html)
- [stats.html](file://stats.html)
- [tests/openai-connection.test.js](file://tests/openai-connection.test.js)
</cite>

## Table of Contents
1. [Routine Monitoring](#routine-monitoring)
2. [Agent Personas and Fallback Content Management](#agent-personas-and-fallback-content-management)
3. [Data Management](#data-management)
4. [Dependency Management](#dependency-management)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Security Recommendations](#security-recommendations)
7. [Quiz Extension](#quiz-extension)
8. [Monitoring and Logging](#monitoring-and-logging)

## Routine Monitoring

### API Usage Monitoring
Monitor API usage through Vercel Insights to track request volume, response times, and error rates. The application's API endpoints are:
- `POST /api/submit`: Saves quiz responses to `answers.json`
- `POST /api/generate-result`: Generates personalized results using OpenAI or fallback content
- `GET /api/stats`: Retrieves aggregated statistics

Use the `/stats.html` page to view real-time statistics including total responses, result distribution, and question-level answer breakdowns.

### answers.json Growth Monitoring
The `answers.json` file stores all quiz submissions with timestamps. Monitor its growth to ensure storage limits are not exceeded. Each entry includes:
- User answers to all 10 questions
- Determined adaptation stage (A, B, C, or D)
- Timestamp of submission
- Unique ID

Regularly check file size and consider implementing automated cleanup procedures for older entries.

### OpenAI Connectivity Verification
Verify OpenAI connectivity using the provided test script:
```bash
npm run test:openai
```

The test in `tests/openai-connection.test.js` validates that the `OPENAI_API_KEY` environment variable is set and that the API responds to requests. Ensure the key is properly configured in Vercel environment variables.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js#L178-L209)
- [tests/openai-connection.test.js](file://tests/openai-connection.test.js#L0-L17)

## Agent Personas and Fallback Content Management

### Updating Agent Personas
The agent persona is defined in the `generate-result.js` API function. The system uses a coaching persona named Alena who helps women in emigration transition from stagnation to movement. Key characteristics:
- Warm, supportive tone
- Respectful of personal boundaries
- Encouraging and uplifting

To update the persona, modify the system message in the OpenAI API call within `generate-result.js`.

### Fallback Content Management
The `fallbackContent` object in `generate-result.js` contains predefined responses for each adaptation stage (A-D). Each stage includes:
- Title with emoji
- Current state description
- Focus area
- Timeline guidance (7/14/30 days)
- First step
- Recommendation
- Bonus suggestion

### Formatting Requirements
When updating fallback content, maintain the following structure:
```javascript
{
  title: 'Emoji Stage Title',
  now: 'Description of current state',
  focus: 'What is important now',
  timeline: {
    7: '7-day guidance',
    14: '14-day guidance', 
    30: '30-day guidance'
  },
  firstStep: 'Immediate action step',
  recommendation: 'General recommendation',
  bonus: 'Additional suggestion'
}
```

### Stage Mapping
The four adaptation stages are mapped as follows:
- **A**: Tourist stage - "While everything is new and interesting"
- **B**: Cultural shock - "The hardest place of adaptation"
- **C**: Uplift - "But still stormy"
- **D**: Recovery and renewed strength phase

The `determineStage` function analyzes answer distribution to determine the dominant stage.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js#L78-L145)

## Data Management

### Statistics Reset
Reset statistics by clearing the `answers.json` file. This can be done manually by replacing the file content with an empty array `[]`, or programmatically through the stats interface.

The `stats.html` page includes a "Reset Statistics" button that prompts for confirmation before clearing local storage data.

### Cleaning Old Responses
To clean old responses, edit the `answers.json` file directly. Remove entries based on timestamp or keep only recent submissions. Consider implementing automated retention policies based on business requirements.

### User Data Backup
Back up user data by copying the `answers.json` file to a secure location. Recommended practices:
- Schedule regular automated backups
- Store backups in encrypted storage
- Maintain version history
- Test restore procedures periodically

The `answers.json` file contains sensitive user information and should be treated as personal data.

**Section sources**
- [answers.json](file://answers.json#L0-L17)
- [stats.html](file://stats.html#L0-L715)

## Dependency Management

### OpenAI Library Upgrade
The application uses the OpenAI library specified in `package.json`:
```json
"dependencies": {
  "openai": "^4.104.0"
}
```

To upgrade:
1. Run `npm install openai@latest`
2. Test the updated version with the OpenAI connectivity test
3. Verify response format compatibility in `generate-result.js`
4. Deploy to staging environment for validation

### Vercel CLI Upgrade
The Vercel CLI is listed as a dev dependency:
```json
"devDependencies": {
  "vercel": "^48.2.9"
}
```

To upgrade:
1. Run `npm install -g vercel@latest`
2. Verify deployment functionality with `vercel --prod`
3. Test both automatic and manual deployment workflows

### Dependency Update Procedure
1. Check for outdated packages: `npm outdated`
2. Update packages: `npm update`
3. Test application functionality
4. Verify deployment process
5. Commit updated `package.json` and `package-lock.json`

**Section sources**
- [package.json](file://package.json#L0-L11)
- [package-lock.json](file://package-lock.json#L0-L1124)

## Troubleshooting Guide

### Failed AI Responses
When AI responses fail, the system automatically falls back to predefined content. Common causes:
- Missing or invalid `OPENAI_API_KEY`
- API rate limiting
- Network connectivity issues
- Invalid response format

Check server logs for error messages. The fallback mechanism in `generate-result.js` ensures users always receive a response even when OpenAI is unavailable.

### Submission Errors
Submission errors typically occur in the `submit.js` API endpoint. Common issues:
- CORS configuration problems
- File system write permissions
- Invalid JSON format
- Network timeouts

Verify the endpoint accepts POST requests and can write to the `answers.json` file. Check that proper headers are set for CORS.

### Display Problems in quiz.html
Display issues in the quiz interface may include:
- Layout rendering problems
- Animation glitches
- Responsive design failures
- Text formatting issues

Ensure the HTML structure matches the expected format with proper question IDs (q0-q9) and answer values (A-D). Verify CSS styles are correctly applied and JavaScript event handlers function properly.

### Vercel Deployment Failures
Deployment failures can result from:
- Missing environment variables
- Package dependency issues
- Build configuration errors
- File permission problems

Check Vercel build logs for specific error messages. Verify `vercel.json` configuration and ensure all required dependencies are specified in `package.json`.

**Section sources**
- [api/submit.js](file://api/submit.js#L0-L62)
- [api/generate-result.js](file://api/generate-result.js#L211-L242)
- [quiz.html](file://quiz.html#L0-L799)
- [vercel.json](file://vercel.json#L0-L5)

## Security Recommendations

### API Key Protection
Protect the OpenAI API key by:
- Storing it in Vercel environment variables, not in code
- Never committing the key to version control
- Using restricted API keys with limited permissions
- Regularly rotating keys

The application accesses the key via `process.env.OPENAI_API_KEY` which should be configured in the Vercel project settings.

### User Data Protection
Protect user data by:
- Treating `answers.json` as sensitive information
- Implementing access controls
- Encrypting backups
- Following data retention policies
- Complying with privacy regulations

The data includes personal responses and names, requiring appropriate security measures.

### Input Validation
Ensure proper input validation in API endpoints to prevent injection attacks. The current implementation includes basic validation but should be enhanced to:
- Sanitize all user inputs
- Validate data types and formats
- Implement rate limiting
- Monitor for suspicious activity

**Section sources**
- [api/generate-result.js](file://api/generate-result.js#L182-L192)
- [answers.json](file://answers.json#L0-L17)

## Quiz Extension

### Adding Additional Questions
To extend the quiz with additional questions:
1. Update the HTML in `quiz.html` with new question elements
2. Ensure each question has a unique ID (e.g., q10, q11)
3. Add corresponding answer options (A, B, C, D)
4. Update the result generation logic in `generate-result.js` to account for new questions
5. Test the updated quiz flow

Maintain the existing answer value convention (A, B, C, D) for consistency.

### Adaptation Stage Updates
To modify or add adaptation stages:
1. Update the `fallbackContent` object in `generate-result.js` with new stage content
2. Modify the `determineStage` function to account for new answer patterns
3. Update the stage mapping in documentation
4. Test with various answer combinations to ensure proper stage determination

Ensure new stages follow the same content structure and formatting guidelines.

**Section sources**
- [quiz.html](file://quiz.html#L0-L799)
- [api/generate-result.js](file://api/generate-result.js#L0-L242)

## Monitoring and Logging

### Vercel Insights Monitoring
Use Vercel Insights to monitor application performance:
- Track API request volume and response times
- Monitor error rates and client-side exceptions
- Analyze user engagement metrics
- Set up alerts for abnormal patterns

The application includes Vercel Insights script in the HTML files for comprehensive monitoring.

### Error Logging Approach
The application implements error logging in API endpoints:
- Console logging for debugging information
- Structured error responses with descriptive messages
- Fallback mechanisms for critical failures
- Client-side error handling in JavaScript

Enhance logging by:
- Implementing structured logging format
- Adding correlation IDs for request tracing
- Setting up centralized log aggregation
- Creating alerts for critical errors

Regularly review logs to identify and resolve issues proactively.

**Section sources**
- [quiz.html](file://quiz.html#L14-L17)
- [api/submit.js](file://api/submit.js#L0-L62)
- [api/generate-result.js](file://api/generate-result.js#L0-L242)