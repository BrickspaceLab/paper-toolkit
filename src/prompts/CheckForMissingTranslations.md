Please highlight any missing translations in this Shopify liquid code. This file is being used for a Shopify theme. All text that is displayed within the theme should pull from translated values.

- Within the {% schema %} we want to use translations for the name, label, info and content values. This should look something like this `"t:general.settings.color_border.label"`
- Within the code any hardcoded text should be replaced with a translation liquid variable like `{{ 'labels.options' | t }}`
- Block and section liquid variables are valid and don't need to be replaced. For example this `{{ block.settings.heading }}` and this `{{ section.settings.heading }}` are both valid

Please share a list of all lines that are not following this standard. You do not need to explain what the lines should be replaced with in your output.
