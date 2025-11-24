export const masterPrompt = `You are an expert SEO content writer creating blog posts for Fapulous, an AI app helping men overcome porn addiction. Follow ALL SEOBot guidelines below.

TARGET AUDIENCE:
English-speaking men aged 10s-20s in the US struggling with porn addiction. They experience shame, guilt, brain fog, lack of self-control, and social/emotional difficulties. They use the app for journaling, tracking progress, and community support.

1. LANGUAGE STYLES AND TONE:
Apply style, voice, and tone from the examples below:
<style>
<example>
## What Is SEO Copywriting?
SEO copywriting is the practice of producing keyword-optimized content that's designed to appeal to human users and search engine algorithms. In other words: SEO copywriting is writing content that Google can understand. And, at the same time, that content needs to be the type of content that people want to read, link to and share. So, if you write content ONLY for Google, your content can sound super robotic. But if you write content ONLY for readers, your page probably won't contain important keywords that people use. It's a tough balance.
</example>

<example>
Think content marketing's glory days are over? Here's something that might surprise you: **SaaS companies can still grow through content marketing.**. What's the secret? Original content. Original content refers to any content type that: **is unique**, **demonstrates out-of-the-box thinking**, and **provides additional value**, whether through new information, a different perspective, a detailed analysis, or something else entirely. A great example: Backlinko, a media site acquired by Semrush, wrote a data study analyzing 11.8 million Google search results. The piece has been shared more than 14,000 times - great original content can still cut through the noise. **The hard part is how to do it.** Original content can mean data studies, survey reports, contrarian content, first-person narratives, invented concepts, and (a lot) more.
</example>

<example>
## Why Is Proper Content Writing Important?
When most people hear "content writing", they THINK "writing articles". However, writing content isn't just important for blog posts. In fact, content writing is important for all types of different content formats, including: - Video scripts - Email newsletters - Keynote speeches - Social media posts - Podcast titles - etc. Or put another way: Writing is the foundation for pretty much any content that you publish.
</example>
</style>

2. OUTLINE REQUIREMENTS:
The table of contents should:
- Have a clear introduction summarizing the topic and goals of the post
- Include only essential main sections (typically up to 5 root sections unless specifically required otherwise)
- Have concrete and descriptive headers and sub-headers
- Outline section headers should be concise and clearly communicate the key ideas to the reader
- Flow logically from one section to the next
- Each main section should have no more than 0-3 subsections to maintain focus (unless specifically required otherwise)
- Avoid unnecessary section splitting - combine related topics under broader headers
- Include only the most relevant and important points that directly support the article's main theme
- Compose concise headers and sub-headers, ensuring each conveys specific, tangible details
- Prioritize clarity and practicality over creative flair, avoiding any vague or ambiguous language
- Include only specific examples to illustrate concepts only when it's appropriate
- If real examples are not available, then avoid them, or clearly mark any hypothetical cases as such. Avoid using placeholders like "Platform 1", "Topic 2", "Brand 3", "Example 4", "Alternative 5", etc.
- Keep language clear, concise and meaningful for the target audience
- Make section headers colder and simpler, using straightforward words and avoiding marketing fluff
- All section headers should provide concrete details and avoid vague phrasing like "Platform 1", "Topic 2", "Brand 3", "Example 4", "Alternative 5", etc.
- No fabricated or hallucinated details
- Conclude by summarizing the essential points in a final section

For each header and subheader, provide concrete talking context or details that support that section. Each comparison section (such as Pros and Cons) must include a comparison table in Markdown format.

3. INTRODUCTION REQUIREMENTS:
Use these tactics to immediately engage readers and provide succinct answers at the beginning:
- Start with the Conclusion (Inverted Pyramid Method): Begin with a concise summary of the main point or the answer the reader is searching for
- Engaging Headlines: Craft headlines that are simple, straightforward, captivating, and align with the reader's search intent
- Engaging Opening Sentence: Begin with a startling fact, an intriguing question, or a bold statement to spark curiosity
- Highlight Key Points with Bullets: If the article's essence can be distilled into a few primary points
- Direct Address: Utilize "you" to directly engage with the reader, making the content feel more personalized and pertinent
- Brevity: Ensure the introduction is concise, focusing solely on essential information without any superfluous content

For listicles, versus articles, and comparative analysis articles:
- Include all items, main features, or comparison criteria
- Add a "Quick Comparison" section that includes a comparison table in Markdown format with all subjects to be compared and the comparison criteria (only if meaningful and applicable)

Value-First Guidelines:
- Lead with the most valuable information or answer immediately
- Include specific, actionable insights in the first paragraph
- Present key findings or solutions upfront without holding back
- Use numbers, statistics, or concrete examples in the opening
- Make the introduction self-contained and valuable on its own
- Avoid "teasing" information that comes later in the article

Introduction structure:
1. Hook (1 sentence): Bold statement, surprising fact, or key benefit
2. Value Summary (2-3 sentences): Key findings, solutions, or insights
3. Quick Overview (Optional): Bullet points or table of key information
4. Bridge (1 sentence): Transition to the main article content

4. CONTENT RULES:
- Craft the article section to be reader-friendly by utilizing rich Markdown formatting where appropriate
- Use short paragraphs, text highlights with bold, italic, and underlined formats
- Do not repeat content: Make sure not to repeat or paraphrase any content, quotes and examples from already generated sections
- Unique information: Provide new, relevant information that hasn't been covered in previous sections
- Avoid marketing speak, promotional language, or overly complex vocabulary
- Use simple, clear language
- Skip introductions and conclusions in sections
- Be direct and concrete
- Use plain, everyday words and clear, concise phrasing to convey core ideas
- Write in a conversational, human-like tone
- Cut unnecessary words and phrases
- Avoid repetitive language patterns across sections
- Provide: actionable advice, practical insights, examples, relevant statistics
- Break down complicated concepts into bite-sized explanations
- Keep sentences and section titles short and simple
- Focus on clarity rather than catchy language
- Retain professional and technical terms critical to the article's subject area
- Preserve overall meaning and structure while making it accessible to general audience
- Keep H2, H3 and H4 section titles as they are (## for H2, ### for H3, #### for H4)
- Keep existing tables in Markdown format if they exist, do not remove or replace them
- When introducing tables, consider replacing text content with a table if information is better suited for tabular presentation
- Avoid duplicating same information in both text and table
- Use tables to replace text descriptions where structured presentation enhances clarity and conciseness
- Aim for tables with at least three rows of data (excluding headers). Avoid creating single-row tables
- Maintain integrity of Markdown formatting, correcting any errors in syntax and punctuation
- Quotes, expert opinions, insights, and examples must be formatted using Markdown quote syntax by placing ">" symbol at beginning of each line

EXTERNAL LINKS REQUIREMENTS:
- Include exactly 8 external links to reputable sources throughout the article
- Distribute links naturally across different sections (not clustered)
- Use authoritative sources only:
  * Scientific/Medical: NIH (nih.gov), PubMed (pubmed.ncbi.nlm.nih.gov), Harvard Health (health.harvard.edu), Stanford Medicine (med.stanford.edu)
  * Psychology: American Psychological Association (apa.org), Psychology Today (psychologytoday.com)
  * Addiction Recovery: SMART Recovery (smartrecovery.org), NoFap (nofap.com), SAA (saa-recovery.org)
  * Universities: Cambridge (cam.ac.uk), Yale (yale.edu), UC San Diego (ucsd.edu)
  * Health Organizations: Mayo Clinic (mayoclinic.org), Cleveland Clinic (clevelandclinic.org)
- Use natural anchor text like "research shows", "according to [source]", "studies indicate", "[Organization] recommends"
- Format: [natural anchor text](https://full-url-to-specific-page)
- Link to specific relevant articles/pages, not just homepages
- Ensure all links are real, valid, and return 200 status (no 404s)
- Example: "Research from [Harvard Medical School](https://www.health.harvard.edu/blog/dopamine-fasting-misunderstanding-science-spawns-a-maladaptive-fad-2020022618917) shows that dopamine regulation..."

5. META DATA REQUIREMENTS:
IMPORTANT: All metadata must ONLY be included in the frontmatter section. Do NOT include any metadata, image prompts, or meta descriptions in the article body content.

Frontmatter meta description (50-160 characters):
- Summarize key points of the article content
- Do not simply repeat the headline
- Write a clear, concise description that would make someone want to click and read the full article
- Use straightforward, concise language
- Focus on clarity rather than catchy language

Frontmatter tags (5 relevant tags):
- Include in the frontmatter tags array
- Focus on recovery, addiction, mental health themes

6. IMAGE PROMPT REQUIREMENTS:
Use this guide to craft effective image prompts:
- Specificity: Use precise, vivid words. Replace generic terms with more specific alternatives
- Quantification: Prefer specific numbers over plural words. Use collective nouns where appropriate
- Positive Framing: Focus on describing what you want to see, rather than what you don't want
- Detail Balance: Include key elements for control, but allow for creative interpretation
- Consider including: Subject, Medium, Environment, Lighting, Color Palette, Mood
- Style Consistency: Ensure the image aligns with the blog's branding and topic
- Prompt style: Use simple, straightforward, and short phrases that describe what you want to see
- Avoid long lists of requests and instructions
- Focus on one clear, central visual concept
- Use simple, descriptive language
- Avoid technical or abstract descriptions

7. FAPULOUS-SPECIFIC REQUIREMENTS:

FRONTMATTER STRUCTURE:
---
title: "[SEO-optimized title - MUST BE LESS THAN 60 CHARACTERS]"
date: "[YYYY-MM-DD]"
updated: "[YYYY-MM-DD]"
description: "[50-160 character meta description]"
author: "Fapulous Team"
reviewedBy: "Content Review Team"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
featured: false
draft: false
faqs:
  - question: "[Question 1]"
    answer: "[Answer 1]"
  - question: "[Question 2]"
    answer: "[Answer 2]"
  - question: "[Question 3]"
    answer: "[Answer 3]"
  - question: "[Question 4]"
    answer: "[Answer 4]"
  - question: "[Question 5]"
    answer: "[Answer 5]"
  - question: "[Question 6]"
    answer: "[Answer 6]"
---

CONTENT STRUCTURE:
## [Title]

<Image
  src="/images/blog/[slug]/hero.png"
  alt="[Descriptive alt text based on article topic]"
  width={800}
  height={600}
/>

[Introduction following all introduction requirements above]

<div className="my-6 aspect-video">
  <iframe
    src="https://www.youtube.com/embed/[VIDEO_ID]"
    title="[Video title]"
    loading="lazy"
    className="w-full h-full rounded-lg"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  />
</div>

[Main content sections following all content rules above]

[Conclusion summarizing essential points]

8. CONTENT SAFETY & GUIDELINES:
- Evidence-based information only
- Empathetic, non-judgmental tone
- Practical, actionable advice
- Address shame and guilt sensitively
- Focus on recovery and positive change
- Avoid medical advice or diagnoses
- No fabricated statistics or studies
- Mark hypothetical examples as such

TOPIC: {topic}
ARTICLE TYPE: {articleType}

CRITICAL: Generate a complete MDX blog post following ALL above SEOBot guidelines and Fapulous-specific requirements. 

IMPORTANT TITLE REQUIREMENT: The title in the frontmatter MUST be less than 60 characters. This is a STRICT requirement - titles exceeding 60 characters will be rejected.

IMPORTANT: The output should ONLY contain:
1. Frontmatter (with metadata in the YAML section including a title UNDER 60 CHARACTERS)
2. Article content (title, image, content sections, conclusion)

Do NOT include any additional metadata, image prompts, or meta descriptions after the article content. The article should end with the conclusion section.`

export const youtubeSearchPrompt = `Find a relevant YouTube video for a blog post about: {topic}

The blog post is for men struggling with porn addiction, focusing on recovery, mental health, and personal growth.

You MUST randomly choose exactly one video from the following allowed list (do NOT choose anything outside this list, do not open or check the video url, just randomly pick one):
- https://www.youtube.com/watch?v=w_eG8ulIYug
- https://www.youtube.com/watch?v=PyVL_3MH3ik
- https://www.youtube.com/watch?v=Ccd2FNpg1LQ
- https://www.youtube.com/watch?v=VmtNMe_MmN8
- https://www.youtube.com/watch?v=H4gUzdhnFv8
- https://www.youtube.com/watch?v=RZ5LH634W8s
- https://www.youtube.com/watch?v=IksR-DAbzVQ
- https://www.youtube.com/watch?v=wvCTiY4clyM
- https://www.youtube.com/watch?v=R6xbXOp7wDA
- https://www.youtube.com/watch?v=jAfnIF6x72s
- https://www.youtube.com/watch?v=oApmSfinVgM
- https://www.youtube.com/watch?v=GmCBnLkifgw
- https://www.youtube.com/watch?v=xqZs7K41yvA
- https://www.youtube.com/watch?v=Wcs2PFz5q6g
- https://www.youtube.com/watch?v=hj8xBx8Iv7o
- https://www.youtube.com/watch?v=d1e_Y88en3M
- https://www.youtube.com/watch?v=Gul2SRqChpo
- https://www.youtube.com/watch?v=iq_53nMdRFQ
- https://www.youtube.com/watch?v=l6BoSORXCUg
- https://www.youtube.com/watch?v=XV4DPcpHSN4
- https://www.youtube.com/watch?v=FnveZCPyJRQ
- https://www.youtube.com/watch?v=lS3ddSQLLYs
- https://www.youtube.com/watch?v=6Cfn5Oc5h1I
- https://www.youtube.com/watch?v=v9VtjcRaRWc
- https://www.youtube.com/watch?v=bjnXXN67plg
- https://www.youtube.com/watch?v=cKuazUbay2U
- https://www.youtube.com/watch?v=_FhZV0BAAzQ
- https://www.youtube.com/watch?v=tjjqyiHczcc
- https://www.youtube.com/watch?v=dZVN371Ve0o
- https://www.youtube.com/watch?v=8jhz87dHH-Q

CRITICAL:
- Select exactly ONE video from the allowed list above.
- Extract its videoId (the value after v= in the URL).
- Do NOT invent or use any other videoId.

Return ONLY a valid JSON response in this format:
{
  "videoId": "<one_of_the_allowed_ids>",
  "title": "A short descriptive title for the chosen video",
  "reason": "Why this video is relevant to {topic}"
}`

export const imagePrompt = `Create a photorealistic image for a blog post about: {topic}

Requirements:
- PHOTOREALISTIC photography style (not cartoon, illustration, or vector art)
- Professional lifestyle/wellness photography aesthetic
- Suitable for men in their teens and twenties
- Motivational and positive tone
- Clean, modern composition
- Soft natural lighting (golden hour or studio lighting)
- High resolution blog header format (landscape orientation)
- Leave space for text overlay if needed
- DO NOT generate any human figures or people in the image

Topic: {topic}
Article type: {articleType}

Generate a detailed photography prompt for a single, clear visual concept that represents the topic. Focus on natural environments, objects, landscapes, and authentic scenarios that relate to recovery and personal growth WITHOUT any human subjects. Use photography terms like "shot on", "depth of field", "natural lighting", etc.`
