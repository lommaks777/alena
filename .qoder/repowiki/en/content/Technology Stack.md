# Technology Stack

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json)
- [vercel.json](file://vercel.json)
- [api/generate-result.js](file://api/generate-result.js)
- [quiz.html](file://quiz.html)
- [index.html](file://index.html)
- [answers.json](file://answers.json)
</cite>

## Table of Contents
1. [Overview](#overview)
2. [Frontend Implementation with HTML/CSS/JavaScript](#frontend-implementation-with-htmlcssjavascript)
3. [Serverless Backend with Vercel Functions](#serverless-backend-with-vercel-functions)
4. [OpenAI Integration for AI-Powered Coaching](#openai-integration-for-ai-powered-coaching)
5. [Deployment and Configuration via Vercel](#deployment-and-configuration-via-vercel)
6. [Data Management with JSON](#data-management-with-json)
7. [Development and Deployment Tooling](#development-and-deployment-tooling)
8. [Technology Integration and Full-Stack Flow](#technology-integration-and-full-stack-flow)
9. [Setup Prerequisites and Environment Configuration](#setup-prerequisites-and-environment-configuration)

## Overview
The alena application is a full-stack serverless web application designed to assess the adaptation stage of women in migration through an interactive quiz. It leverages modern web technologies and artificial intelligence to deliver personalized coaching responses. The architecture combines static frontend assets with dynamic serverless functions, using JavaScript across both client and server environments. The system integrates the OpenAI API to generate empathetic, personalized feedback based on user responses, deployed seamlessly through Vercel's cloud platform. This document details the technology stack, explaining how each component contributes to the application's functionality, scalability, and user experience.

**Section sources**
- [package.json](file://package.json)
- [vercel.json](file://vercel.json)

## Frontend Implementation with HTML/CSS/JavaScript
The frontend of the alena application is built using static HTML, CSS, and client-side JavaScript, ensuring fast loading times and broad compatibility. The primary user interface is delivered through `quiz.html`, which contains a responsive, interactive form that guides users through a series of questions about their emotional and practical experiences in a new country. The page uses modern CSS features including flexbox, CSS gradients, transitions, and media queries to create an engaging, mobile-friendly experience.

Client-side JavaScript handles the quiz logic, including question navigation, progress tracking, and dynamic UI updates. The script manages state for the current question, validates user input, and animates transitions between questions using CSS opacity and transform properties. Upon completion, the frontend collects user responses and name input, then sends this data via a POST request to the `/api/generate-result` serverless function. The `index.html` file serves as a redirector to `quiz.html`, ensuring users land directly on the main quiz interface.

The frontend also includes embedded tracking via Vercel Insights, using a lightweight script to monitor user interactions without impacting performance. All styling is contained within a single `<style>` block in `quiz.html`, minimizing HTTP requests and simplifying deployment.

**Section sources**
- [quiz.html](file://quiz.html#L0-L799)
- [index.html](file://index.html#L0-L14)

## Serverless Backend with Vercel Functions
The backend of the alena application consists of serverless functions hosted on Vercel, with `api/generate-result.js` serving as the primary endpoint for processing quiz submissions. This function runs in a Node.js environment and is triggered by HTTP POST requests from the frontend. The function implements a complete request-response cycle with proper CORS headers, allowing cross-origin communication between the frontend and backend.

The serverless function handles multiple aspects of request processing: it parses incoming JSON data, validates the request method, and manages error conditions gracefully. It extracts user responses, name, and question/answer text mappings from the request body. The function includes comprehensive error handling with fallback mechanisms, ensuring that users receive meaningful feedback even if the primary AI processing fails.

The architecture follows a serverless pattern where each function invocation is stateless and ephemeral, scaling automatically with user demand. This approach eliminates the need for server management, reduces operational overhead, and ensures cost efficiency by charging only for actual usage. The function's modular design separates concerns between response generation, fallback content creation, and HTML escaping, promoting maintainability and testability.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js#L0-L242)

## OpenAI Integration for AI-Powered Coaching
The alena application integrates the OpenAI library (version ^4.104.0) to generate personalized coaching responses that simulate a professional coach's guidance. This integration occurs within the `generate-result.js` serverless function, where user responses are formatted into a structured prompt and sent to the OpenAI API. The application uses the `gpt-4o-mini` model, which provides a balance of advanced reasoning capabilities and cost efficiency.

The integration follows a specific workflow: user responses are compiled into a natural language format, then combined with a detailed system prompt that defines the coaching persona, tone, and response structure. The system prompt instructs the AI to address the user by name, follow a specific six-section format with exact CSS class names, and include appropriate emojis while avoiding clichés. The API request includes parameters such as temperature (0.8) for creative variation and a maximum token limit (800) to control response length.

A robust fallback mechanism ensures reliability: if the OpenAI API key is missing, the API returns an error, or the response is empty, the application generates a pre-defined coaching response based on the dominant answer pattern (A, B, C, or D). This fallback content provides stage-specific guidance for the four adaptation stages: Tourist, Immersion, Fatigue, and New Self. The integration also includes HTML escaping functions to prevent XSS vulnerabilities when rendering user-generated content.

**Section sources**
- [api/generate-result.js](file://api/generate-result.js#L188-L209)
- [package.json](file://package.json#L6-L7)

## Deployment and Configuration via Vercel
The alena application is deployed and managed using Vercel, a cloud platform optimized for static sites and serverless functions. The deployment configuration is defined in `vercel.json`, which specifies key deployment parameters: the project version (2), the installation command (`npm install`), the build command (`echo Build ready`), and the output directory (`.`). This configuration enables Vercel to automatically install dependencies and deploy the application from the root directory.

Vercel's serverless architecture automatically handles scaling, security, and global content delivery, ensuring low-latency access for users worldwide. The platform integrates with Git for continuous deployment, meaning that code changes pushed to the repository automatically trigger a new deployment. The serverless functions are deployed as API endpoints under the `/api` route, with Vercel managing the routing, load balancing, and SSL termination.

The deployment strategy leverages Vercel's zero-configuration approach for static assets, serving HTML, CSS, and JavaScript files directly from a global CDN. Serverless functions are bundled and deployed as isolated execution environments, with cold start times optimized by Vercel's infrastructure. The configuration's simplicity reflects the application's straightforward build process, as it requires no complex compilation or asset transformation.

**Section sources**
- [vercel.json](file://vercel.json#L0-L5)

## Data Management with JSON
The alena application uses JSON as its primary data format for both configuration and storage. The `package.json` file contains project metadata and dependency specifications, including the OpenAI library and Vercel CLI as a development dependency. This file enables consistent dependency management across development and deployment environments through npm.

User responses are temporarily stored in `answers.json`, which serves as a lightweight data store for quiz submissions. This file contains an array of response objects, each including a timestamp, the user's answers to the nine questions, and the determined adaptation stage. This JSON structure allows for easy data analysis and potential future export or processing.

The application uses JSON extensively in its data flow: client-side JavaScript serializes form data into JSON format before sending it to the serverless function, which then parses the JSON payload and processes the data. The serverless function returns its response as a JSON object containing the generated HTML content, which the frontend then renders. This consistent use of JSON throughout the stack ensures interoperability between components and simplifies data handling.

**Section sources**
- [package.json](file://package.json#L0-L11)
- [answers.json](file://answers.json#L0-L17)

## Development and Deployment Tooling
The alena application relies on a streamlined set of development and deployment tools centered around the Vercel ecosystem. The Vercel CLI (version ^48.2.9) is included as a development dependency, enabling developers to test, debug, and deploy the application locally before pushing changes to production. This tool provides a local development server that simulates the Vercel production environment, allowing for accurate testing of serverless functions and deployment behavior.

The development workflow is designed for simplicity and efficiency: developers can write code using any text editor, test changes locally with the Vercel CLI, and deploy to production through Git integration. The package.json file defines the project structure and dependencies, ensuring consistent setup across different development environments. The application does not require complex build tools or transpilation, as it uses standard JavaScript that runs natively in both browser and Node.js environments.

This tooling approach minimizes the development overhead while maximizing deployment reliability. The Vercel CLI enables features such as environment variable management, logs inspection, and performance monitoring, providing developers with the necessary tools to maintain and improve the application. The tight integration between the Vercel platform and development tools creates a seamless workflow from coding to production deployment.

**Section sources**
- [package.json](file://package.json#L8-L9)

## Technology Integration and Full-Stack Flow
The alena application demonstrates a cohesive integration of technologies that work together to create a full-stack serverless application with AI capabilities. The flow begins with the user accessing the static `quiz.html` page, which loads entirely from a CDN for optimal performance. Client-side JavaScript manages the interactive quiz experience, collecting user responses and preparing them for submission.

When the user completes the quiz, the frontend sends a POST request containing JSON data to the `/api/generate-result` serverless function hosted on Vercel. This function, written in JavaScript and running in a Node.js environment, processes the request by first validating the input and setting appropriate CORS headers. It then formats the user's responses into a natural language prompt that includes specific instructions for the AI model.

The function uses the OpenAI library to send this prompt to the GPT-4o-mini model, including the user's name and response patterns. The AI generates a personalized coaching response in HTML format, which is returned to the frontend as JSON. If the AI integration fails for any reason, the function falls back to a pre-defined response based on the most frequent answer choice, ensuring users always receive meaningful feedback.

This architecture exemplifies a modern serverless pattern: static frontend assets are served from a CDN, dynamic processing occurs in scalable serverless functions, and AI capabilities are integrated via external APIs. The entire stack uses JavaScript, creating a unified development experience across client and server. Data flows as JSON throughout the system, ensuring compatibility and simplicity. The application is deployed and managed through Vercel, which handles scaling, security, and global distribution automatically.

**Section sources**
- [quiz.html](file://quiz.html#L0-L799)
- [api/generate-result.js](file://api/generate-result.js#L0-L242)
- [package.json](file://package.json#L0-L11)
- [vercel.json](file://vercel.json#L0-L5)

## Setup Prerequisites and Environment Configuration
To set up and run the alena application, several prerequisites must be met. The development environment requires Node.js (version 14 or higher) and npm (Node Package Manager) to manage dependencies and run the Vercel CLI. Developers should also have a Vercel account and the Vercel CLI installed globally via `npm install -g vercel`.

The most critical configuration is the OpenAI API key, which must be set as an environment variable named `OPENAI_API_KEY` in the Vercel project settings. Without this key, the application will operate in fallback mode, generating pre-defined responses instead of AI-powered coaching. During development, this key can be stored in a `.env` file or configured through the Vercel dashboard.

The application's configuration is primarily controlled through the `vercel.json` file, which requires no modification for standard deployment. The `package.json` file specifies all dependencies, which are automatically installed during deployment. No database setup is required, as the application uses file-based JSON storage for user responses.

For deployment, developers push code changes to a connected Git repository (GitHub, GitLab, or Bitbucket), triggering an automatic build and deployment process on Vercel. Alternatively, the Vercel CLI can be used to deploy manually with the `vercel` command. The application is designed to work immediately after deployment, with no additional configuration steps required beyond setting the OpenAI API key.

**Section sources**
- [package.json](file://package.json#L0-L11)
- [vercel.json](file://vercel.json#L0-L5)
- [api/generate-result.js](file://api/generate-result.js#L0-L242)