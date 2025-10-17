# Statistics API

<cite>
**Referenced Files in This Document**   
- [api/stats.js](file://api/stats.js)
- [answers.json](file://answers.json)
- [DATA_STORAGE.md](file://DATA_STORAGE.md)
- [stats.html](file://stats.html)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Endpoint Overview](#endpoint-overview)
3. [Response Structure](#response-structure)
4. [Implementation Details](#implementation-details)
5. [Data Processing Logic](#data-processing-logic)
6. [Error Handling](#error-handling)
7. [Data Source and Persistence](#data-source-and-persistence)
8. [Usage and Integration](#usage-and-integration)
9. [Example Responses](#example-responses)
10. [Performance Considerations](#performance-considerations)
11. [Security Aspects](#security-aspects)
12. [Architecture Overview](#architecture-overview)

## Introduction
The Statistics API provides analytics on user responses collected through the quiz system. This documentation details the `/api/stats` endpoint, which serves as the primary interface for retrieving aggregated statistical data about quiz completions. The endpoint is designed to support data analysis and visualization, particularly for the administrative dashboard at `stats.html`. The implementation leverages Express.js running on Vercel serverless functions, utilizing file system access for data persistence. This document covers the endpoint's functionality, implementation, error handling, data processing, and integration points.

**Section sources**
- [api/stats.js](file://api/stats.js#L1-L67)
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L1-L172)

## Endpoint Overview
The `/api/stats` endpoint is a GET request that returns comprehensive analytics on user quiz responses. It is specifically designed to provide aggregate statistics without exposing individual user data. The endpoint supports CORS to enable cross-origin requests from the frontend application. It only accepts GET and OPTIONS methods, with OPTIONS requests handled for preflight checks in CORS implementation. Any other HTTP method results in a 405 Method Not Allowed response. The endpoint is read-only and does not modify any data, making it safe for frequent polling by client applications.

```mermaid
flowchart TD
Client["Client Application"] --> |GET /api/stats| Server["Serverless Function"]
Server --> |Check Method| MethodValidation["Method Validation"]
MethodValidation --> |Not GET/OPTIONS| Return405["Return 405 Method Not Allowed"]
MethodValidation --> |OPTIONS| Return200Options["Return 200 OK (OPTIONS)"]
MethodValidation --> |GET| ReadFile["Read answers.json"]
ReadFile --> |File Not Found| ReturnEmptyStats["Return Empty Statistics"]
ReadFile --> |File Read Success| ProcessData["Process Response Data"]
ProcessData --> CalculateMetrics["Calculate Distribution Metrics"]
CalculateMetrics --> Return200["Return 200 OK with Statistics"]
ReadFile --> |Other Error| Return500["Return 500 Internal Server Error"]
Return405 --> Client
Return200Options --> Client
ReturnEmptyStats --> Client
Return200 --> Client
Return500 --> Client
```

**Diagram sources**
- [api/stats.js](file://api/stats.js#L1-L67)

**Section sources**
- [api/stats.js](file://api/stats.js#L1-L67)

## Response Structure
The `/api/stats` endpoint returns a JSON response containing three main fields that provide comprehensive analytics on quiz responses. The `totalResponses` field contains a numeric value representing the total number of completed quizzes. The `resultsDistribution` field is an object that maps each adaptation stage (A-D) to the count of users who received that result, providing insight into user distribution across different adaptation levels. The `answersDistribution` field is a nested object that contains per-question answer frequencies, with each question ID mapping to an object that counts responses for each possible answer option (A-D). This structure enables detailed analysis of user preferences and patterns across all quiz questions.

```mermaid
erDiagram
STATS_RESPONSE {
number totalResponses
object resultsDistribution
object answersDistribution
}
RESULTS_DISTRIBUTION {
number A
number B
number C
number D
}
ANSWERS_DISTRIBUTION {
object q1
object q2
object q3
object q4
object q5
object q6
object q7
object q8
object q9
object q10
}
ANSWER_COUNTS {
number A
number B
number C
number D
}
STATS_RESPONSE ||--|| RESULTS_DISTRIBUTION : "contains"
STATS_RESPONSE ||--|| ANSWERS_DISTRIBUTION : "contains"
ANSWERS_DISTRIBUTION }o--|| ANSWER_COUNTS : "maps to"
```

**Diagram sources**
- [api/stats.js](file://api/stats.js#L45-L65)
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L61-L82)

**Section sources**
- [api/stats.js](file://api/stats.js#L45-L65)
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L61-L82)

## Implementation Details
The `/api/stats` endpoint is implemented as an Express.js serverless function deployed on Vercel. The implementation uses modern JavaScript features including ES modules and async/await syntax for handling asynchronous operations. The function begins by setting appropriate CORS headers to allow cross-origin requests from any domain, which facilitates integration with the frontend application. The endpoint specifically allows GET and OPTIONS methods, with OPTIONS requests handled immediately to support CORS preflight checks. When a GET request is received, the function reads the `answers.json` file from the file system, processes the data to calculate statistical metrics, and returns the results as JSON. The implementation is designed to be stateless, which aligns with serverless architecture principles, and relies entirely on the file system for data persistence.

**Section sources**
- [api/stats.js](file://api/stats.js#L1-L67)

## Data Processing Logic
The data processing logic in the `/api/stats` endpoint aggregates responses from the `answers.json` file to calculate key distribution metrics. For `totalResponses`, the implementation simply uses the length of the parsed JSON array, representing the count of completed quizzes. The `resultsDistribution` is calculated using the Array.reduce method to iterate through all answers and count occurrences of each adaptation stage (A-D) in the result field. The `answersDistribution` is similarly calculated by reducing the array of responses, but with additional logic to initialize counters for each question and answer option. For each response, the function iterates through the answers object, incrementing the counter for the selected answer option for each question. This processing occurs entirely in memory after reading and parsing the JSON file, with the results formatted into the response structure before being sent to the client.

```mermaid
flowchart TD
Start["Start Data Processing"] --> Initialize["Initialize Counters"]
Initialize --> LoopResponses["Loop Through All Responses"]
LoopResponses --> ProcessResult["Process Result Field"]
ProcessResult --> |Increment Counter| UpdateResultsDist["Update resultsDistribution"]
LoopResponses --> LoopAnswers["Loop Through Answers"]
LoopAnswers --> GetQuestion["Get Question ID"]
LoopAnswers --> GetAnswer["Get Selected Answer"]
GetQuestion --> CheckQuestion["Check if Question Exists in answersDistribution"]
CheckQuestion --> |No| InitializeQuestion["Initialize Question with A:0, B:0, C:0, D:0"]
CheckQuestion --> |Yes| ContinueProcessing
InitializeQuestion --> ContinueProcessing
ContinueProcessing --> IncrementAnswer["Increment Answer Counter"]
IncrementAnswer --> |More Answers| LoopAnswers
IncrementAnswer --> |More Responses| LoopResponses
LoopResponses --> |No More Responses| FormatResponse["Format Response Object"]
FormatResponse --> Return["Return Statistics"]
style Start fill:#4CAF50,stroke:#388E3C
style Return fill:#4CAF50,stroke:#388E3C
```

**Diagram sources**
- [api/stats.js](file://api/stats.js#L45-L65)

**Section sources**
- [api/stats.js](file://api/stats.js#L45-L65)

## Error Handling
The `/api/stats` endpoint implements comprehensive error handling to ensure reliable operation under various conditions. The primary error scenario addressed is the absence of the `answers.json` file, which is handled gracefully by returning an empty statistics object with zero counts rather than failing the request. This is achieved by catching the 'ENOENT' error code specifically and returning a 200 OK response with default empty values for all statistical fields. For other file system errors or unexpected exceptions during file reading or JSON parsing, the endpoint returns a 500 Internal Server Error response with a generic error message. All errors are logged to the server console for debugging purposes. The implementation also validates the HTTP method, returning a 405 Method Not Allowed response for any method other than GET or OPTIONS, preventing unintended access patterns.

**Section sources**
- [api/stats.js](file://api/stats.js#L25-L35)
- [api/stats.js](file://api/stats.js#L60-L67)

## Data Source and Persistence
The `/api/stats` endpoint relies on `answers.json` as its sole data source for generating statistics. This JSON file, located in the project root, stores an array of quiz response objects, with each object containing timestamp, answers, and result fields. The file serves as the persistent data store for the entire quiz system, with both the submission and statistics endpoints reading from and writing to this single file. In the serverless environment of Vercel, this approach has significant implications for data consistency and concurrency. Since serverless functions are stateless and may run on different instances, there is a risk of race conditions when multiple requests access the file simultaneously. The current implementation does not include locking mechanisms, which could lead to data corruption under high load. For production use, the documentation recommends migrating to a proper database solution like Vercel Postgres or MongoDB Atlas to ensure data integrity and scalability.

**Section sources**
- [answers.json](file://answers.json#L1-L17)
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L1-L59)
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L153-L172)

## Usage and Integration
The `/api/stats` endpoint is primarily used by the `stats.html` dashboard to populate its analytics interface. The dashboard makes a fetch request to the endpoint and processes the response to update various visual elements including summary cards, bar charts, and detailed question statistics. The client-side JavaScript in `stats.html` maps the API response fields to its internal statistics model, with `totalResponses` updating the total completions count, `resultsDistribution` powering the adaptation stage bar chart, and `answersDistribution` driving the per-question answer frequency displays. The integration is designed to be resilient, with error handling that falls back to localStorage data if the API request fails. The read-only nature of the endpoint makes it suitable for frequent polling, though the current implementation does not include caching headers, which could be added to improve performance and reduce server load.

**Section sources**
- [stats.html](file://stats.html#L395-L418)
- [stats.html](file://stats.html#L316-L341)

## Example Responses
The `/api/stats` endpoint returns statistical data in a consistent JSON format. When no responses have been recorded, the endpoint returns an empty statistics object:

```json
{
  "totalResponses": 0,
  "resultsDistribution": {},
  "answersDistribution": {}
}
```

With responses recorded, a typical response might appear as:

```json
{
  "totalResponses": 42,
  "resultsDistribution": {
    "A": 10,
    "B": 15,
    "C": 12,
    "D": 5
  },
  "answersDistribution": {
    "q1": {
      "A": 10,
      "B": 15,
      "C": 12,
      "D": 5
    },
    "q2": {
      "A": 8,
      "B": 18,
      "C": 10,
      "D": 6
    }
  }
}
```

These examples illustrate the structure and content of responses under different conditions, showing how the endpoint provides meaningful analytics even when no data is available.

**Section sources**
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L61-L82)

## Performance Considerations
The current implementation of the `/api/stats` endpoint has performance implications that become significant as the dataset grows. Each request requires reading the entire `answers.json` file from disk and parsing it as JSON, which creates O(n) time complexity relative to the number of responses. For large datasets, this could result in slow response times and increased serverless function execution duration, potentially leading to timeouts. The lack of caching means that identical requests repeat the same file I/O and processing operations, representing an inefficient use of resources. Potential optimizations include implementing response caching with appropriate headers, using a database with indexing for faster queries, or preprocessing statistics at submission time rather than calculating them on each request. For the serverless environment, these optimizations are crucial to maintain performance and control costs, as longer execution times directly impact resource consumption and expenses.

**Section sources**
- [api/stats.js](file://api/stats.js#L25-L35)
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L153-L172)

## Security Aspects
The `/api/stats` endpoint exposes aggregate data about quiz responses, which raises several security considerations. Currently, the endpoint has no authentication or access controls, making the statistical data publicly accessible to anyone who can reach the API endpoint. While the data is aggregated and does not expose individual user identities directly, it could still reveal sensitive information about user behavior patterns and demographics. The documentation notes that `answers.json` contains personal data, highlighting the importance of protecting access to the underlying data source. For production deployment, the documentation recommends adding authentication to restrict access to authorized personnel only. Additionally, the use of wildcard CORS headers ('Access-Control-Allow-Origin', '*') allows any website to access the statistics, which could be exploited for data scraping. Implementing more restrictive CORS policies and access controls would enhance the security posture of the endpoint.

**Section sources**
- [DATA_STORAGE.md](file://DATA_STORAGE.md#L111-L120)
- [api/stats.js](file://api/stats.js#L6-L10)

## Architecture Overview
The Statistics API is part of a broader architecture that includes client-side interfaces, serverless functions, and file-based data persistence. The architecture follows a simple but effective pattern for a lightweight quiz application, with the `/api/stats` endpoint serving as a key component for data analysis. The system architecture can be visualized as a three-tier structure: the presentation layer (`stats.html`), the application layer (serverless functions in the `api` directory), and the data layer (`answers.json`). This separation of concerns allows for independent development and deployment of each component. The use of serverless functions on Vercel provides scalability and reduces infrastructure management overhead, while the file-based data storage offers simplicity for development and testing. However, as noted in the documentation, this architecture has limitations for production use, particularly regarding data consistency and scalability, suggesting a migration to more robust data storage solutions as the application grows.

```mermaid
graph TD
subgraph "Presentation Layer"
A[stats.html Dashboard]
B[quiz.html Interface]
end
subgraph "Application Layer"
C[/api/stats<br>Serverless Function/]
D[/api/submit<br>Serverless Function/]
end
subgraph "Data Layer"
E[(answers.json<br>File Storage)]
end
A --> C
B --> D
C --> E
D --> E
style C fill:#667eea,stroke:#333
style D fill:#667eea,stroke:#333
style E fill:#4CAF50,stroke:#388E3C
```

**Diagram sources**
- [api/stats.js](file://api/stats.js)
- [stats.html](file://stats.html)
- [answers.json](file://answers.json)

**Section sources**
- [api/stats.js](file://api/stats.js)
- [stats.html](file://stats.html)
- [answers.json](file://answers.json)
- [DATA_STORAGE.md](file://DATA_STORAGE.md)