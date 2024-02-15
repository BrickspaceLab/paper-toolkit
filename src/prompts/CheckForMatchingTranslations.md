Please review this Shopify liquid code and ensure all translation values are pulling from the correct places. 

- Within the {% schema %} we want to use translations for the name, label, info and content values. This should look something like this `"t:sections.all.colors.settings.color_border.label"`
- All translations should start with `"t:sections.all.` OR `"t:sections.all.[FILE_NAME]` 
- [FILE_NAME] is replace with the file name. For example within `content-slider.liquid` the correct translation should start with either `"t:sections.all.` OR `"t:sections.content_slider.` 

Please share a list of all lines that are not following this standard. You do not need to explain what the lines should be replaced with in your output.
