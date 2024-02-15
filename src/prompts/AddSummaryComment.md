Please update the top of this Shopify liquid file to include a comment that explains this code for other developers. This comment should include 1) a summary of the file 2) all global liquid variables that start with `{{ settings.`. These variables should include there type and a short description 3) Recomendations on how to best use this file 4) if the file is a snippet we'll want to also include a list of arguments that are accepted 5) if the file is a snippet we'll want to include a sample usage example. If the file is a section file please skip over the Accepts and Usage comments.

Below is an example of this

```
<!-- snippets/component__content-item.liquid -->
{% comment %} 
  Thumbnail for simple content in a product or collection grid.
  
  Accepts:
  - heading: {string} Set content for heading text.
  - content: {string} Set content for body text.
  - button_label: {string} Set content for button text.
  - url: {string} Set URL for this block.
  - image: {object} Liquid object for image values.
  - image_background: {object} Liquid object for background image values.
  - video: {object} Liquid object for video values.
  - enable_autoplay: {boolean} Indicates if video should autoplay.
  - enable_mute_toggle: {boolean} Indicates if video should include mute buttons.
  - enable_loop: {boolean} Indicates if video should loop.
  - color_scheme: {string} Class string to set color.
  - color_border: {string} Class string to set border color.
  - color_text: {string} Class string to set text color.
  - color_button: {string} Class string to set button color.
  - enable_gradient: {boolean} Indicates if content should use a gradient.
  - spacing_top: {integer} Set top padding within block.
  - spacing_bottom: {integer} Set bottom padding within block.
  - enable_padding: {boolean} Indicates if content should use padding.
  - layout_col_span_desktop: {string} Class string to set column span on desktop.
  - layout_col_span_mobile: {string} Class string to set column span on mobile.
  - layout_row_span_desktop: {string} Class string to set row span on desktop.
  - layout_row_span_mobile: {string} Class string to set row span on mobile.
  - layout_y_alignment: {string} Class string to set vertical aligment.
  - layout_x_alignment: {string} Class string to set horizontal aligment (left, center, right).
  
  Globals:
  - settings.layout_horizontal: {string} Class string to set horizontal margin.
  
  Usage:
    {% render 'component__content-item',
      heading: block.settings.heading,
      content: block.settings.content,
      button_label: block.settings.button_label,
      url: block.settings.url,
      image: block.settings.image,
      image_background: block.settings.image_background,
      video: block.settings.video,
      enable_autoplay: block.settings.enable_autoplay,
      enable_mute_toggle: block.settings.enable_mute_toggle,
      enable_loop: block.settings.enable_loop,
      color_scheme: block.settings.color_scheme,
      color_border: block.settings.color_border,
      color_text: block.settings.color_text,
      color_button: block.settings.color_button,
      enable_gradient: block.settings.enable_gradient,
      spacing_top: block.settings.spacing_top,
      spacing_bottom: block.settings.spacing_bottom,
      enable_padding: block.settings.enable_padding,
      layout_col_span_desktop: 'md:col-span-2',
      layout_col_span_mobile: 'col-span-2' ,
      layout_row_span_desktop: 'md:row-span-2',
      layout_row_span_mobile: 'row-span-2',
      layout_y_alignment: block.settings.layout_y_alignment,
      layout_x_alignment: block.settings.layout_x_alignment
    %}
  
  Recommendations:
  - Use this snippet to display promotional content.
{% endcomment %}
```