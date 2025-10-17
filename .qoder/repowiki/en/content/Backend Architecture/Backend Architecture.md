# Backend Architecture

<cite>
**Referenced Files in This Document**   
- [generate-result.js](file://api/generate-result.js)
- [submit.js](file://api/submit.js)
- [stats.js](file://api/stats.js)
- [answers.json](file://answers.json)
- [vercel.json](file://vercel.json)
- [package.json](file://package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive architectural documentation for the backend serverless functions in the Alena application. The system is built on Vercel's serverless infrastructure and consists of three primary API endpoints: `generate-result.js`, `submit.js`, and `stats.js`. These functions support a psychological assessment quiz designed to help women in migration identify their adaptation stage and receive personalized guidance.

The backend follows a stateless, event-driven model typical of serverless architectures, with request-response patterns, CORS handling, and JSON payloads. Data persistence is implemented via a file-based system using `answers.json`, and AI-powered feedback generation is orchestrated through OpenAI's API with fallback logic. This documentation details the data flow, execution model, error resilience, and scalability characteristics of the system.

## Project Structure

```mermaid
graph TD
subgraph "API Endpoints"
A[generate-result.js]
B[submit.js]
C[stats.js]
end
subgraph "Data & Configuration"
D[answers.json]
E[vercel.json]
F[package.json]
end
subgraph "Frontend"
G[index.html]
H[quiz.html]
I[thank-you.html]
end
A --> D
B --> D
C --> D
G --> A
G --> B
H --> A
H --> B
I --> C
E --> A
E --> B
E --> C
```

**Diagram sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)
- [answers.json](file://answers.json)
- [vercel.json](file://vercel.json)

**Section sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)
- [answers.json](file://answers.json)
- [vercel.json](file://vercel.json)

## Core Components

The backend consists of three serverless functions deployed on Vercel:

- **generate-result.js**: AI-powered feedback generator that analyzes user responses and returns personalized HTML content via OpenAI, with fallback logic.
- **submit.js**: Handles persistence of user quiz answers to `answers.json` with timestamp and unique ID.
- **stats.js**: Provides analytics on response distribution and adaptation stages across all users.

All functions implement CORS headers to allow cross-origin requests from the frontend, and follow a stateless execution model where each invocation is independent and ephemeral.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)

## Architecture Overview

```mermaid
graph LR
F[Frontend] --> |POST /api/submit| B[submit.js]
F --> |POST /api/generate-result| C[generate-result.js]
F --> |GET /api/stats| D[stats.js]
B --> |Write| A[answers.json]
C --> |Read| A
D --> |Read| A
C --> |POST /chat/completions| O[OpenAI API]
O --> |Response| C
subgraph "Vercel Serverless Environment"
B
C
D
A
end
style B fill:#4CAF50,stroke:#388E3C
style C fill:#2196F3,stroke:#1976D2
style D fill:#FF9800,stroke:#F57C00
style A fill:#9C27B0,stroke:#7B1FA2
style O fill:#607D8B,stroke:#455A64
```

**Diagram sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)
- [answers.json](file://answers.json)

## Detailed Component Analysis

### generate-result.js Analysis

This function generates personalized feedback using OpenAI's GPT-4o-mini model based on user answers. It implements a robust fallback mechanism in case of API unavailability.

```mermaid
sequenceDiagram
participant Frontend
participant GenerateResult as generate-result.js
participant OpenAI
Frontend->>GenerateResult : POST /api/generate-result
GenerateResult->>GenerateResult : Parse request body
GenerateResult->>GenerateResult : Determine adaptation stage
alt OpenAI Key Missing
GenerateResult->>GenerateResult : Use fallback content
else OpenAI Available
GenerateResult->>OpenAI : POST /chat/completions
alt OpenAI Success
OpenAI-->>GenerateResult : Return AI-generated HTML
else OpenAI Error
GenerateResult->>GenerateResult : Use fallback content
end
end
GenerateResult-->>Frontend : Return HTML result
```

**Diagram sources**
- [api/generate-result.js](file://api/generate-result.js#L131-L242)

**Section sources**
- [api/generate-result.js](file://api/generate-result.js)

### submit.js Analysis

Handles the persistence of user answers to a JSON file, adding metadata such as timestamp and unique ID.

```mermaid
flowchart TD
Start([Request Received]) --> ValidateMethod{"Method == POST?"}
ValidateMethod --> |No| Return405[Return 405]
ValidateMethod --> |Yes| ReadFile["Read answers.json"]
ReadFile --> |File Not Found| InitEmpty["Initialize empty array"]
ReadFile --> |Success| ParseData["Parse JSON"]
InitEmpty --> AddData
ParseData --> AddData["Add new answers with timestamp and ID"]
AddData --> WriteFile["Write back to answers.json"]
WriteFile --> Return200[Return 200 OK]
```

**Diagram sources**
- [api/submit.js](file://api/submit.js#L4-L62)

**Section sources**
- [api/submit.js](file://api/submit.js)

### stats.js Analysis

Provides analytical insights by aggregating data from all stored responses.

```mermaid
flowchart TD
Start([GET /api/stats]) --> ReadAnswers["Read answers.json"]
ReadAnswers --> |File Not Found| ReturnEmpty["Return empty stats"]
ReadAnswers --> |Success| ParseAnswers["Parse JSON"]
ParseAnswers --> CountTotal["Count total responses"]
ParseAnswers --> DistributeResults["Count result distribution"]
ParseAnswers --> DistributeAnswers["Count answer distribution per question"]
CountTotal --> Assemble
DistributeResults --> Assemble
DistributeAnswers --> Assemble
Assemble[Assemble response JSON] --> ReturnStats[Return 200 with stats]
```

**Diagram sources**
- [api/stats.js](file://api/stats.js)

**Section sources**
- [api/stats.js](file://api/stats.js)

## Dependency Analysis

```mermaid
graph TD
A[generate-result.js] --> |Uses| B[OpenAI API]
A --> |Reads| C[answers.json]
A --> |Uses| D[process.env.OPENAI_API_KEY]
B[submit.js] --> |Reads/Writes| C[answers.json]
B --> |Uses| E[fs/promises]
B --> |Uses| F[path]
C[stats.js] --> |Reads| C[answers.json]
C --> |Uses| G[express]
C --> |Uses| H[fs.promises]
D --> |Configured in| I[vercel.json]
I --> |Deploys| A
I --> |Deploys| B
I --> |Deploys| C
```

**Diagram sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)
- [answers.json](file://answers.json)
- [vercel.json](file://vercel.json)

**Section sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)
- [vercel.json](file://vercel.json)

## Performance Considerations

The serverless architecture introduces cold start latency, particularly for `generate-result.js` which must initialize the OpenAI request pipeline. The file-based persistence in `answers.json` presents scalability limitations as concurrent writes may cause race conditions without proper locking mechanisms.

The system is stateless, ensuring horizontal scalability, but file I/O operations on Vercel's ephemeral filesystem may impact performance under high load. The fallback content in `generate-result.js` ensures availability even when OpenAI API is unreachable, improving resilience.

Data aggregation in `stats.js` loads the entire `answers.json` into memory, which may become problematic as the dataset grows. Pagination or database integration would be recommended for long-term scalability.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)
- [answers.json](file://answers.json)

## Troubleshooting Guide

Common issues and their resolutions:

- **OpenAI API failures**: The system automatically falls back to predefined content. Ensure `OPENAI_API_KEY` is set in Vercel environment variables.
- **File write conflicts**: Concurrent submissions may overwrite data. Implement atomic writes or consider a database.
- **CORS errors**: All endpoints set `Access-Control-Allow-Origin: *`, but verify frontend origin matches.
- **Empty responses**: Check request payload structure; must include `name` and `answers` fields.
- **Stats not updating**: Verify `answers.json` is being written correctly by `submit.js`.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js)
- [api/submit.js](file://api/submit.js)
- [api/stats.js](file://api/stats.js)

## Conclusion

The Alena application employs a clean, serverless backend architecture on Vercel with three well-defined functions handling feedback generation, data persistence, and analytics. The system demonstrates thoughtful error handling with fallback content and proper CORS configuration. While the file-based storage is simple and effective for low-to-medium traffic, it presents concurrency and scalability challenges that should be addressed in future iterations. The integration with OpenAI enables personalized user experiences, and the modular function design supports maintainability and independent deployment.