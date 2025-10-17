# Prompt Engineering

<cite>
**Referenced Files in This Document**   
- [generate-result.js](file://api/generate-result.js)
- [quiz.html](file://quiz.html)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prompt Construction](#prompt-construction)
3. [System Role Definition](#system-role-definition)
4. [User Context Injection](#user-context-injection)
5. [Response Structure and Formatting Requirements](#response-structure-and-formatting-requirements)
6. [Required Response Blocks](#required-response-blocks)
7. [HTML Output and CSS Class Usage](#html-output-and-css-class-usage)
8. [Emoji Usage for Emotional Tone](#emoji-usage-for-emotional-tone)
9. [User Answers Formatting](#user-answers-formatting)
10. [Fallback Mechanism](#fallback-mechanism)
11. [Best Practices in Prompt Design](#best-practices-in-prompt-design)
12. [Troubleshooting Malformed Responses](#troubleshooting-malformed-responses)
13. [Iterative Refinement Strategies](#iterative-refinement-strategies)
14. [Conclusion](#conclusion)

## Introduction
This document details the prompt engineering strategy implemented in `generate-result.js` to generate personalized coaching advice for users completing a self-assessment quiz. The system leverages OpenAI's GPT-4o-mini model to deliver structured, empathetic, and actionable content tailored to individual responses. The prompt is carefully designed to enforce strict output formatting, ensure personalization, and maintain a supportive tone aligned with the coach's voice. When AI generation fails, a robust fallback mechanism ensures users still receive meaningful guidance.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L1-L242)

## Prompt Construction
The prompt construction process begins with collecting user input: name, quiz answers, question texts, and answer labels. These elements are dynamically injected into a structured prompt template that guides the AI model to produce consistent, high-quality coaching content. The final prompt combines a system role definition, formatting instructions, and user-specific context to generate personalized HTML output.

The construction follows a multi-step approach:
1. Extract and sanitize user inputs
2. Format quiz answers with corresponding question and answer texts
3. Build a comprehensive prompt with clear structural requirements
4. Submit to OpenAI API with controlled parameters

This design ensures reproducibility while allowing for personalization based on user data.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L130-L180)

## System Role Definition
The AI is assigned a specific persona to ensure consistent tone and expertise: "Ты профессиональный коуч и маркетолог Алена, который помогает женщинам в эмиграции мягко переходить из застоя в движение." This establishes the AI as a professional coach and marketer named Alena who specializes in helping women navigate immigration challenges.

The system message reinforces this role: "Ты эмпатичный коуч и маркетолог, который помогает женщинам в эмиграции. Пиши структурированно, с лёгкими эмодзи и вдохновляющими формулировками, но без клише." This emphasizes empathy, structured writing, appropriate emoji use, and avoidance of clichés.

This dual-layer role definition ensures the AI maintains a warm, supportive, and professional tone throughout the generated content.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L130-L131)
- [generate-result.js](file://api/generate-result.js#L200-L203)

## User Context Injection
User context is injected into the prompt through several key variables:
- **Name**: Personalizes the advice by addressing the user directly
- **Answers**: Provides the behavioral data that informs coaching recommendations
- **Question Texts**: Supplies the full text of each question for context
- **Answer Texts**: Includes the descriptive labels for each answer option

The name is safely escaped and inserted into the prompt with the instruction: "Обращайся к человеку по имени (${safeName})." This ensures personalization while preventing injection attacks.

The answers are formatted with their corresponding question and answer texts, creating a clear narrative of the user's choices that the AI can reference in its analysis.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L148-L157)
- [generate-result.js](file://api/generate-result.js#L177-L179)

## Response Structure and Formatting Requirements
The prompt enforces strict structural requirements to ensure consistency across all generated outputs. These requirements are explicitly stated in the prompt:

1. Address the user by name
2. Follow a six-block structure with specific h2 headings
3. Use h3 subheadings for the timeline section
4. Return clean HTML without wrappers
5. Use only permitted HTML tags
6. Include appropriate emojis without overuse
7. Avoid calls to action unless explicitly requested
8. Write concise paragraphs without excessive whitespace

These constraints ensure that the output is predictable, display-ready, and maintainable within the frontend application.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L102-L117)

## Required Response Blocks
The prompt mandates six specific response blocks, each with a designated purpose and formatted with the CSS class `section-title`:

1. **Where You Are**: Provides an empathetic assessment of the user's current emotional and situational state
2. **What Matters Now**: Identifies the most important focus areas for the user's immediate attention
3. **7/14/30 Days**: Offers a progressive timeline of development with specific milestones
4. **First Step**: Recommends an immediate, actionable step the user can take
5. **Recommendation**: Provides broader strategic guidance for ongoing progress
6. **Bonus**: Offers an additional supportive practice or resource

Each block serves a distinct coaching function, creating a comprehensive roadmap for personal development.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L109-L126)

## HTML Output and CSS Class Usage
The system requires clean HTML output using a restricted set of tags: h2, h3, p, ul, li, strong, and em. This ensures compatibility with the frontend styling and prevents potential security issues.

All main section headings must use the exact format: `<h2 class="section-title">Section Name</h2>`. This CSS class is used by the frontend to apply consistent styling across all coaching results.

The prompt explicitly instructs: "Верни только чистый HTML-код без обёрток <html> или \`\`\`html\`\`\`." This ensures the output can be directly injected into the DOM without preprocessing.

The restricted tag set and enforced class usage create a predictable, styled output that integrates seamlessly with the application's design system.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L117-L118)
- [generate-result.js](file://api/generate-result.js#L167-L172)

## Emoji Usage for Emotional Tone
Emojis are strategically used to enhance emotional resonance and create a warm, supportive tone. The prompt allows for "уместные эмодзи, но не перегружай текст" (appropriate emojis, but don't overload the text).

Emojis appear in several contexts:
- Stage indicators (✈️, 🌊, 🌑, 🌅) that visually represent the user's current phase
- Decorative elements in loading messages and success indicators (💫)
- Emotional amplifiers within the coaching content

The system balances emoji use to maintain professionalism while creating an approachable, human-like interaction. Overuse is discouraged to prevent the content from appearing unprofessional or distracting.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L120)
- [quiz.html](file://quiz.html#L1359)
- [quiz.html](file://quiz.html#L1367)

## User Answers Formatting
User answers are formatted to provide clear context for the AI model. The formatting process:

1. Excludes the name question (q0) from the answer list
2. Maps each answer to its corresponding question text
3. Replaces answer codes (A, B, C, D) with their descriptive labels
4. Joins questions and answers with "Ответ:" for clarity
5. Separates answer pairs with double newlines

The formatted output appears as:
```
[Question Text]
Ответ: [Answer Label]

[Next Question Text]
Ответ: [Next Answer Label]
```

This format creates a readable narrative of the user's choices that the AI can analyze to generate personalized insights. The clear separation and labeling ensure the AI correctly interprets each response.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L148-L157)
- [generate-result.js](file://api/generate-result.js#L179)

## Fallback Mechanism
The system implements a comprehensive fallback mechanism to ensure users receive coaching content even when the AI service is unavailable. This is critical for maintaining user trust and providing consistent service.

The fallback is triggered in three scenarios:
1. Missing OpenAI API key
2. API request failure
3. Empty or invalid AI response

When triggered, the system uses `buildFallbackResult()` to generate static coaching content based on the dominant answer type in the user's responses. The `determineStage()` function analyzes answer frequencies to identify the user's primary stage (A, B, C, or D), then selects corresponding content from `fallbackContent`.

The fallback content mirrors the structure of AI-generated responses, ensuring visual and experiential consistency. This includes the same six sections, HTML formatting, and CSS classes, providing users with a seamless experience regardless of which content generation method is used.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L182-L242)
- [generate-result.js](file://api/generate-result.js#L1-L85)

## Best Practices in Prompt Design
The prompt engineering strategy exemplifies several best practices in AI prompt design:

**Clarity**: The instructions are explicit and unambiguous, leaving little room for interpretation. Each requirement is stated clearly with examples where helpful.

**Structure Enforcement**: The prompt mandates a specific structure with exact HTML formatting, ensuring consistent output that can be reliably rendered by the frontend.

**Context Provision**: Sufficient context is provided through user answers, question texts, and answer labels, enabling the AI to generate relevant, personalized content.

**Constraint Management**: The prompt limits HTML tags and emoji usage to prevent formatting issues and maintain professional tone.

**Error Prevention**: Input sanitization with `escapeHtml()` prevents XSS attacks and ensures special characters are handled safely.

**Tone Guidance**: The system role definition establishes a warm, supportive, and professional tone that aligns with the coaching context.

**Output Control**: By specifying "верни только чистый HTML-код", the prompt prevents the AI from adding explanatory text or markdown wrappers.

These practices work together to create a reliable, secure, and effective prompt that consistently produces high-quality coaching content.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L130-L180)

## Troubleshooting Malformed Responses
The system includes robust error handling for various failure modes:

**API Connection Issues**: When the OpenAI API is unreachable or returns an error, the system logs the error and serves fallback content with a 'fallback' warning.

**Empty Responses**: If the AI returns no content, the system serves fallback content with an 'empty' warning, ensuring users never receive a blank response.

**Parsing Errors**: The system safely handles JSON parsing errors in the request body by using default values and serving fallback content with an 'exception' warning.

**Frontend Fallback**: The client-side code in `quiz.html` includes additional fallback logic. If the AI response fails to generate, it uses `calculateResult()` to determine the user's stage and displays basic results.

**Content Validation**: The frontend's `personaliseResultLayout()` function includes parsing logic to handle various response formats, attempting to extract meaningful content even from malformed responses.

These layered fallback mechanisms ensure high availability and reliability, maintaining user trust even during technical difficulties.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L211-L242)
- [quiz.html](file://quiz.html#L1418-L1447)

## Iterative Refinement Strategies
The prompt engineering approach supports iterative refinement through several mechanisms:

**Parameter Tuning**: The temperature is set to 0.8, allowing for creativity while maintaining coherence. This can be adjusted based on content quality assessment.

**Structured Feedback**: The system returns warning indicators ('fallback', 'empty', 'exception') that can be logged and analyzed to identify patterns in AI performance.

**Content Updates**: The `fallbackContent` object can be updated to reflect improved coaching methodologies, with changes automatically reflected in both AI-generated and fallback content.

**Prompt Versioning**: The prompt structure allows for incremental improvements without breaking the output format, enabling A/B testing of different phrasings and instructions.

**Usage Monitoring**: By analyzing which fallback triggers are most common, developers can identify reliability issues and prioritize improvements.

**User Experience Analysis**: The countdown timer and loading messages create an expectation of AI-generated content, which can be studied to optimize perceived performance.

These strategies enable continuous improvement of both the prompt effectiveness and overall user experience.

**Section sources**
- [generate-result.js](file://api/generate-result.js#L130-L180)
- [quiz.html](file://quiz.html#L1343-L1368)

## Conclusion
The prompt engineering strategy in `generate-result.js` demonstrates a sophisticated approach to generating personalized coaching advice. By combining clear role definition, structured formatting requirements, comprehensive user context, and robust fallback mechanisms, the system delivers consistent, high-quality content tailored to individual users. The emphasis on security, reliability, and user experience ensures that participants receive valuable guidance regardless of technical conditions. This implementation serves as a model for effective prompt engineering in therapeutic and coaching applications, balancing personalization with structure, creativity with reliability, and innovation with accessibility.