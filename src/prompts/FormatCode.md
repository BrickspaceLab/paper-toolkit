1. HTML Properties:
   - Group related properties together (e.g., class, id, data attributes)
   - For the `class` attribute:
     - Sort class names alphabetically
   - Place Alpine.js attributes at the end of the element, after all other attributes
   - For the contents of Alpine.js attributes:
     - Format using standard JavaScript formatting for readability
     - Place the contents on a new line if it exceeds a certain length (e.g., 80 characters)
   - For all other HTML attributes:
     - Place the contents on a new line unless the attribute only contains a single word

2. Liquid `{% render %}` Tag:
   - When using the `{% render %}` tag, format it as follows:
     ```liquid
     {% render 'component__icon', 
       icon: 'plus',
       size: '16',
       class: ''
     %}
     ```
   - Place the `{% render %}` tag on a new line
   - Indent the attributes correctly, with each attribute on a separate line
   - Align the attributes vertically for better visual clarity
   - Follow this same format for all liquid tags

3. Indentation:
   - Use consistent indentation throughout the code (2 spaces)
   - Indent nested elements properly to improve readability
   - Align attributes vertically for better visual clarity

4. Comments:
   - Add comments to explain complex or non-obvious code sections
   - Use comments to describe the purpose or functionality of specific elements or blocks of code
   - Follow a consistent commenting style using Liquid tags to contain comments, such as `{% comment %} {% endcomment %}`

5. Whitespace:
   - Remove unnecessary whitespace, such as trailing spaces or multiple blank lines
   - Add appropriate spacing around operators, parentheses, and curly braces
   - Use blank lines to separate logical sections of code